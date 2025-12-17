import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  PanResponder,
  PermissionsAndroid,
  Platform,
  Keyboard,
} from 'react-native';
import TextInput from '../../components/common/TextInput';
import IconButton from '../../components/common/iconButton';
import ChargerList from '../../components/charger/ChargerList';
import SelectableButton from '../../components/common/SelectableButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChargerFilter from '../../components/charger/ChargerFilter';
import {WebView} from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
import {
  getNearbyStations,
  searchStation,
  getAutocomplete,
} from '../../utils/StationApi';
import DropdownModalAuto from '../../components/common/DropdownModalAuto';

export default function ChargerMainScreen({navigation}) {
  /** ---------------- 필터 상태 ---------------- */
  const [pressed, setPressed] = useState(false); // 상단 "무료"
  const [speed, setSpeed] = useState(''); // 상단 급속/완속 (fast/slow)
  const [searchPressed, setSearchPressed] = useState(false);

  // 모달 필터 상태
  const [filterCompany, setFilterCompany] = useState([]); // 회사 배열
  const [filterType, setFilterType] = useState([]); // 타입 배열
  const [filterSpeed, setFilterSpeed] = useState([]); // ['급속','중속','완속']
  const [filterOpenType, setFilterOpenType] = useState(''); // '무료'
  const [filterWait, setFilterWait] = useState(''); // '대기없음'
  const [station, setStation] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [autoList, setAutoList] = useState([]);
  const [autoVisible, setAutoVisible] = useState(false);
  const [inputLayout, setInputLayout] = useState({x: 0, y: 0, width: 0});
  const [inputBox, setInputBox] = useState({height: 0});
  const [isSelecting, setIsSelecting] = useState(false);

  const webRef = useRef(null);
  const isMapReady = useRef(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const chargerTypeMap = {
    '01': 'DC차데모',
    '02': 'AC완속',
    '03': 'DC차데모+AC3상',
    '04': 'DC콤보',
    '05': 'DC차데모+DC콤보',
    '06': 'DC복합',
    '07': 'AC3상',
    '08': 'DC콤보(완속)',
    '09': 'NACS',
    10: 'DC콤보+NACS',
    11: 'DC콤보2 (버스전용)',
  };

  const chargerTypeReverseMap = Object.fromEntries(
    Object.entries(chargerTypeMap).map(([code, name]) => [name, code]),
  );

  /** ---------------- 공통 유틸 ---------------- */

  const safePostMessage = msg => {
    if (!webRef.current) {
      console.log('⚠️ WebView 로드 전 메시지 → 무시');
      return;
    }
    webRef.current.postMessage(msg);
  };

  const sendToWebView = msg => safePostMessage(msg);

  /** ---------------- 필터 로직 ---------------- */
  const getFilteredStations = () => {
    let filtered = [...station];

    // ---- 무료 필터 (상단 버튼 OR 모달 "무료") ----
    const wantFree = pressed || filterOpenType === '무료';
    if (wantFree) {
      filtered = filtered.filter(s => s.stationParkingFree === 'Y');
    }

    // ---- 회사 필터 ----
    if (filterCompany.length > 0) {
      filtered = filtered.filter(s => {
        if (!s.chargerProviders) return false;
        const providers = s.chargerProviders
          .split(',')
          .map(v => v.trim())
          .filter(v => v.length > 0);
        return providers.some(p => filterCompany.includes(p));
      });
    }

    // ---- 타입 필터 ----
    if (filterType.length > 0) {
      // UI에서 선택한 문자열을 코드 배열로 변환
      const selectedCodes = filterType.map(name => chargerTypeReverseMap[name]);

      filtered = filtered.filter(s => {
        if (!s.chargerTypes) return false;

        // 실제 API 데이터 속 타입 코드 목록
        const stationCodes = s.chargerTypes
          .split(',')
          .map(v => v.trim())
          .filter(v => v.length > 0);

        // 겹치는 코드가 하나라도 있으면 통과
        return stationCodes.some(code => selectedCodes.includes(code));
      });
    }

    // ---- 속도 필터 (상단 급속/완속 + 모달 속도) ----
    const parseSpeeds = speeds => {
      if (!speeds) return [];
      return speeds
        .split(',')
        .map(v => Number(v.trim()))
        .filter(v => !isNaN(v));
    };

    const wantFast = speed === 'fast' || filterSpeed.includes('급속');
    const wantSlow = speed === 'slow' || filterSpeed.includes('완속');
    const wantMid = filterSpeed.includes('중속');

    if (wantFast || wantMid || wantSlow) {
      filtered = filtered.filter(s => {
        const speeds = parseSpeeds(s.chargerSpeeds);
        if (speeds.length === 0) return false;

        return speeds.some(v => {
          if (wantFast && v >= 150) return true; // 급속
          if (wantMid && v > 70 && v < 150) return true; // 중속
          if (wantSlow && v <= 70) return true; // 완속
          return false;
        });
      });
    }

    // ---- 대기없음 (대기없음 = 사용가능 충전기 > 0 이라고 가정) ----
    if (filterWait === '대기없음') {
      filtered = filtered.filter(s => {
        if (typeof s.chargerAvailable !== 'number') return false;
        return s.chargerAvailable > 0;
      });
    }

    return filtered;
  };

  const FilteredStations = getFilteredStations();

  /** ---------------- 위치 권한 ---------------- */

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '현재 위치 접근',
            message: '지도를 위해 위치 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거부',
            buttonPositive: '허용',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('위치 권한 허용됨');
        } else {
          console.log('위치 권한 거부됨');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    if (Platform.OS === 'android') {
      requestPermission();
    }
  }, []);

  /** ---------------- 지도 / 위치 ---------------- */

  const moveToCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;

        // 1) 지도 이동
        safePostMessage(
          JSON.stringify({
            type: 'moveTo',
            lat: latitude,
            lng: longitude,
          }),
        );

        // 2) 현재 위치 기준 충전소 조회 → station 상태만 업데이트
        const nearby = await getNearbyStations(latitude, longitude);
        setStation(nearby);

        console.log('📍 현재위치 기준 충전소 새로고침 완료');
      },
      error => {
        console.log('현재 위치 오류:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  // 최초 진입 시 현재 위치 기준 조회
  useEffect(() => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const nearby = await getNearbyStations(latitude, longitude);

        // 지도 센터 이동
        safePostMessage(
          JSON.stringify({
            type: 'moveTo',
            lat: latitude,
            lng: longitude,
          }),
        );

        // station만 세팅 → 핀은 아래 useEffect에서 한 번에 처리
        setStation(nearby);
      },
      error => console.log(error),
      {enableHighAccuracy: true},
    );
  }, []);

  // station 또는 필터 값 바뀔 때마다 WebView 핀 갱신
  useEffect(() => {
    if (!isMapReady.current) return;

    const latest = getFilteredStations();
    safePostMessage(
      JSON.stringify({
        type: 'addStations',
        stations: latest,
      }),
    );
  }, [
    station,
    pressed,
    speed,
    filterCompany,
    filterType,
    filterSpeed,
    filterOpenType,
    filterWait,
  ]);

  /** ---------------- 검색 ---------------- */

 const handleSearch = async () => {
    if (!searchText.trim()) {
      setAutoVisible(false); // 빈 문자열일 때도 닫아주기
      return;
    }

    Keyboard.dismiss();

    // 자동완성 모달 닫기
    setAutoVisible(false);

    const result = await searchStation(searchText);
    if (!result) return;

    const {lat, lng, stations} = result;

    // 지도 이동
    safePostMessage(
      JSON.stringify({
        type: 'moveTo',
        lat,
        lng,
      }),
    );

    setStation(stations);
    setSearchText('');
  };

  /** ---------------- 바텀시트 ---------------- */
  const SHEET_HEIGHT = 450;
  const PEEK_AREA = 80;
  const CLOSED_Y = SHEET_HEIGHT - PEEK_AREA;
  const OPEN_Y = 0;
  const SNAP = 40;

  const sheetY = useRef(new Animated.Value(CLOSED_Y)).current;
  const lastYRef = useRef(CLOSED_Y);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderMove: (_, gesture) => {
        let newY = lastYRef.current + gesture.dy;
        if (newY < OPEN_Y) newY = OPEN_Y;
        if (newY > CLOSED_Y) newY = CLOSED_Y;
        sheetY.setValue(newY);
      },
      onPanResponderRelease: (_, gesture) => {
        let newY = lastYRef.current + gesture.dy;

        const mid = (OPEN_Y + CLOSED_Y) / 2;
        const toValue =
          newY < mid - SNAP
            ? OPEN_Y
            : newY > mid + SNAP
            ? CLOSED_Y
            : newY - OPEN_Y < CLOSED_Y - newY
            ? OPEN_Y
            : CLOSED_Y;

        Animated.spring(sheetY, {
          toValue,
          useNativeDriver: false,
        }).start(() => {
          lastYRef.current = toValue;
          sheetY.setValue(toValue);
        });
      },
    }),
  ).current;

  const onPressItem = item => {
    navigation.navigate('ChargerDetail', {charger: item});
  };

  /** ---------------- 필터 모달 애니메이션 ---------------- */
  const FILTER_HEIGHT = 450;
  const filterY = useRef(new Animated.Value(FILTER_HEIGHT)).current;
  const [filterOpen, setFilterOpen] = useState(false);

  const openFilter = () => {
    setFilterOpen(true);
    Animated.timing(filterY, {
      toValue: 0,
      duration: 280,
      useNativeDriver: false,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(filterY, {
      toValue: FILTER_HEIGHT,
      duration: 260,
      useNativeDriver: false,
    }).start(() => setFilterOpen(false));
  };

  const applyFilter = (company, type, speedList, open, wait) => {
    setFilterCompany(company);
    setFilterType(type);
    setFilterSpeed(speedList);
    setFilterOpenType(open);
    setFilterWait(wait);
    closeFilter();
  };

  /** ---------------- 렌더링 ---------------- */
  return (
    <View style={styles.container}>
      {/* WebView 지도 */}
      <WebView
        ref={webRef}
        source={{uri: 'file:///android_asset/map.html'}}
        style={styles.map}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        injectedJavaScript={`window.ReactNativeWebView = window.ReactNativeWebView || {};`}
        onLoad={() => {
          isMapReady.current = true;
        }}
        onMessage={e => {
          let msg = e.nativeEvent.data;
          try {
            msg = JSON.parse(msg);
          } catch {}

          if (msg.type === 'markerClick') {
            const index = FilteredStations.findIndex(
              st => st.stationId === msg.stationId,
            );

            if (index !== -1) {
              setSelectedStationId(msg.stationId);

              listRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0,
              });

              Animated.spring(sheetY, {
                toValue: OPEN_Y,
                useNativeDriver: false,
              }).start(() => {
                lastYRef.current = OPEN_Y;
              });
            }
          }
        }}
      />

      {/* 검색창 */}
      <View style={styles.searchWrapper} pointerEvents="box-none">
        <TextInput
          ref={inputRef}
          placeholder="주소를 입력하세요."
          width="88%"
          value={searchText}
          onChangeText={async text => {
            if (isSelecting) {
              setSearchText(text);
              setIsSelecting(false);
              return;
            }

            setSearchText(text);

            if (!text.trim()) {
              setAutoList([]);
              setAutoVisible(false);
              return;
            }
            try {
              const list = await getAutocomplete(text);

              setAutoList(
                list.map(doc => ({
                  label: doc.place_name || doc.address_name,
                  lat: doc.y,
                  lng: doc.x,
                })),
              );

              // 자동완성 표시
              setAutoVisible(true);
            } catch (err) {
              console.log('자동완성 오류:', err);
            }
          }}
          inputStyle={styles.searchInput}
          onLayout={e => {
            const {width, height} = e.nativeEvent.layout;
            setInputBox({height});
            // width만 저장
            setInputLayout(prev => ({...prev, width}));
          }}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          blurOnSubmit={true}
        />

        <Pressable
          onPress={handleSearch}
          onPressIn={() => setSearchPressed(true)}
          onPressOut={() => setSearchPressed(false)}
          style={[
            styles.searchButton,
            searchPressed && {backgroundColor: '#003766'},
          ]}>
          <MaterialCommunityIcons name="magnify" size={20} color="white" />
        </Pressable>
      </View>

      <DropdownModalAuto
        visible={autoVisible}
        onClose={() => setAutoVisible(false)}
        options={autoList.map(item => ({
          label: item.label,
          value: item,
        }))}
        selectedValue={null}
        onSelect={item => {
          setIsSelecting(true);
          setAutoVisible(false);
          setSearchText(item.label);

          safePostMessage(
            JSON.stringify({
              type: 'moveTo',
              lat: item.value.lat,
              lng: item.value.lng,
            }),
          );

          handleSearch();
        }}
        top={inputLayout.y + inputBox.height + 20} // 🔥 인풋 "바닥" 위치
        left={inputLayout.x + 10}
        width={inputLayout.width}
      />

      {/* 필터 버튼 + 셀렉터 */}
      <View style={styles.filterRadio} pointerEvents="box-none">
        <IconButton
          type="filter"
          size={15}
          onPress={openFilter}
          style={[styles.filterButton, {elevation: 15}]}
        />

        <SelectableButton
          label={<Text style={{fontSize: 14}}>무료</Text>}
          icon={<MaterialCommunityIcons name="parking" />}
          onPress={() => setPressed(prev => !prev)}
          selected={pressed}
          style={styles.filterItem}
        />

        <SelectableButton
          label={<Text style={{fontSize: 14}}>급속</Text>}
          icon={<MaterialCommunityIcons name="lightning-bolt-outline" />}
          selected={speed === 'fast'}
          onPress={() => setSpeed(speed === 'fast' ? '' : 'fast')}
          style={styles.filterItem}
        />

        <SelectableButton
          label={<Text style={{fontSize: 14}}>완속</Text>}
          icon={<MaterialCommunityIcons name="power-plug-outline" />}
          selected={speed === 'slow'}
          onPress={() => setSpeed(speed === 'slow' ? '' : 'slow')}
          style={styles.filterItem}
        />
      </View>

      {/* Zoom 버튼 */}
      <View style={styles.zoomWrapper} pointerEvents="box-none">
        <Pressable
          style={styles.zoomBtn}
          onPress={() => sendToWebView('zoomIn')}>
          <Text style={styles.zoomText}>+</Text>
        </Pressable>
        <Pressable
          style={styles.zoomBtn}
          onPress={() => sendToWebView('zoomOut')}>
          <Text style={styles.zoomText}>-</Text>
        </Pressable>
      </View>

      {/* 현재 위치 버튼 */}
      <IconButton
        type="currentLocation"
        style={styles.currentLocation}
        size={20}
        color="#004E89"
        onPress={moveToCurrentLocation}
      />

      {/* 바텀시트 */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: SHEET_HEIGHT,
            transform: [{translateY: sheetY}],
            zIndex: 50,
          },
        ]}
        {...panResponder.panHandlers}>
        <ChargerList
          ref={listRef}
          data={FilteredStations}
          count={FilteredStations.length}
          selectedStationId={selectedStationId}
          onPressItem={onPressItem}
        />
      </Animated.View>

      {/* 필터 모달 */}
      {filterOpen && (
        <View style={styles.overlay}>
          <Pressable style={styles.overlayBackground} onPress={closeFilter} />

          <Animated.View
            style={[
              styles.filterWrapper,
              {height: FILTER_HEIGHT, transform: [{translateY: filterY}]},
            ]}>
            <ChargerFilter
              company={filterCompany}
              type={filterType}
              speed={filterSpeed}
              open={filterOpenType}
              wait={filterWait}
              onClose={closeFilter}
              onApply={applyFilter}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},

  map: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },

  searchWrapper: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 20,
    flexDirection: 'row',
    zIndex: 10,
  },

  searchInput: {
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },

  searchButton: {
    marginLeft: 5,
    backgroundColor: '#004E89',
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterRadio: {
    position: 'absolute',
    top: 80,
    left: 10,
    right: 20,
    flexDirection: 'row',
    zIndex: 10,
  },

  filterButton: {
    backgroundColor: '#fff',
    width: 50,
    height: 35,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  filterItem: {
    paddingVertical: 8,
    marginRight: 6,
    elevation: 5,
  },

  currentLocation: {
    position: 'absolute',
    bottom: 90,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    elevation: 6,
    zIndex: 10,
  },

  zoomWrapper: {
    position: 'absolute',
    top: 150,
    right: 10,
    alignItems: 'center',
    zIndex: 10,
  },

  zoomBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffffdd',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  zoomText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#ffffffdd',
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 998,
  },

  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  filterWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 30,
    zIndex: 999,
  },
});
