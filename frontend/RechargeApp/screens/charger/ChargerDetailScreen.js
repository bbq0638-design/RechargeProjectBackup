import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Image,
} from 'react-native';
import SelectableButton from '../../components/common/SelectableButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import IconButton from '../../components/common/iconButton';
import PlaceItem from '../../components/place/PlaceItem';
import {getNearbyPlace} from '../../utils/StationApi';

export default function ChargerDetailScreen({route}) {
  const [category, setCategory] = useState('FD6');
  const [showMore, setShowMore] = useState(false);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  // 카카오 categoryCode → DB categoryId 매핑
  const frontToDbCategoryMap = {
    FD6: 'KAKAO06',
    CE7: 'KAKAO07',
    CS2: 'KAKAO02',
    CT1: 'KAKAO09',
    AT4: 'KAKAO04',
    PO3: 'KAKAO03',
    AD5: 'KAKAO05',
    HP8: 'KAKAO08',
    MT1: 'KAKAO01',
    BK9: 'KAKAO10',
  };

  const station = route.params?.charger;
  if (!station) return <Text>데이터 없음</Text>;

  useEffect(() => {
    if (!category) {
      setFilteredPlaces(places); // 전체 보기
    } else {
      const dbCategory = frontToDbCategoryMap[category];
      const filtered = places.filter(p => p.categoryId === dbCategory);
      setFilteredPlaces(filtered);
    }
  }, [category, places]);

  useEffect(() => {
    if (station.stationLatitude && station.stationLongitude) {
      loadPlaces();
    }
  }, []);

  const loadPlaces = async () => {
    try {
      const res = await getNearbyPlace(
        station.stationLatitude,
        station.stationLongitude,
        1.0,
      );
      setPlaces(res);
      setFilteredPlaces(res);
    } catch (e) {
      console.log('주변 장소 불러오기 실패', e);
    }
  };

  const name = station.stationName;
  const fullAddress = `${station.stationAddress ?? ''} ${
    station.stationAddressDetail ?? ''
  }`.trim();

  const types = station.chargerTypes
    ? station.chargerTypes.split(',').map(t => t.trim())
    : [];
  const speeds = station.chargerSpeeds
    ? station.chargerSpeeds.split(',').map(s => s.trim())
    : [];

  const providers = station.chargerProviders
    ? station.chargerProviders.split(',').map(p => p.trim())
    : [];
  const providerName = [...new Set(providers)].join(', ');

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

  const getSpeedLabel = speed => {
    const s = Number(speed);
    if (s <= 7) return '완속';
    if (s >= 150) return '급속';
    return '중속';
  };

  // 🔥 타입+속도별 그룹핑 & 개수 카운트
  const countMap = new Map();
  types.forEach((type, i) => {
    const mappedType = chargerTypeMap[type] ?? type;
    const kw = speeds[i] || '';
    const speedLabel = kw ? `${getSpeedLabel(kw)}` : '';

    const key = `${mappedType}||${speedLabel}`;
    countMap.set(key, (countMap.get(key) || 0) + 1);
  });

  // 🔥 상세 화면 타입별 총 count 기반
  // 🔥 전체 가용수 & 전체 개수
  const available = Number(station.chargerAvailable ?? 0);
  const total = Number(station.chargerTotal ?? types.length);

  // 🔥 타입+속도별 그룹핑 & 개수 계산 + 가용수 비율 적용
  const chargerList = [...countMap.entries()].map(([key, count]) => {
    const [typeLabel, speedLabel] = key.split('||');

    const typeAvailable =
      total > 0 ? Math.round((available / total) * count) : 0;

    return {
      typeLabel,
      speedLabel,
      available: typeAvailable,
      total: count,
    };
  });

  // const samplePlaces = [
  //   {
  //     name: '맛있는 국밥집',
  //     address1: '서울 강남구 테헤란로 123',
  //     address2: 'B1',
  //   },
  //   {name: '라떼맛집 카페', address1: '서울 강남구 역삼로 211'},
  // ];

  const openKakaoMap = async address => {
    const encoded = encodeURIComponent(address);
    const appUrl = `kakaomap://search?q=${encoded}`;
    const webUrl = `https://map.kakao.com/?q=${encoded}`;
    const supported = await Linking.canOpenURL(appUrl);
    return Linking.openURL(supported ? appUrl : webUrl);
  };

  const openNaverMap = async address => {
    const encoded = encodeURIComponent(address);
    const appUrl = `naversearchapp://keywordsearch?keyword=${encoded}`;
    const webUrl = `https://map.naver.com/v5/search/${encoded}`;
    const supported = await Linking.canOpenURL(appUrl);
    return Linking.openURL(supported ? appUrl : webUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedContent}>
        <View style={styles.headerRow}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.row}>
              <IconButton type="charge" size={16} color="#6B7280" />
              <Text style={styles.address}>{fullAddress}</Text>
            </View>
          </View>

          {/* map buttons */}
          <View style={styles.mapColumn}>
            <Pressable
              onPress={() => openKakaoMap(fullAddress)}
              style={styles.headerMapButton}>
              <View style={styles.mapButtonInner}>
                <Image
                  source={require('../../assets/images/kakao-logo.png')}
                  style={styles.headerMapIcon}
                />
                <Text style={styles.headerMapButtonText}>카카오맵</Text>
              </View>
            </Pressable>

            <View style={{height: 7}} />

            <Pressable
              onPress={() => openNaverMap(fullAddress)}
              style={styles.headerMapButton}>
              <View style={styles.mapButtonInner}>
                <Image
                  source={require('../../assets/images/naver-logo.png')}
                  style={styles.headerMapIcon}
                />
                <Text style={styles.headerMapButtonText}>네이버지도</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <Text style={styles.company}>{providerName}</Text>

        {/* 🔋 타입/속도 그룹 표시 */}
        <View style={styles.chargerCard}>
          {chargerList.map((c, index) => (
            <View key={index}>
              <View style={styles.chargerRow}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={22}
                  color="#004E89"
                  style={{marginRight: 8}}
                />

                {/* 라벨 */}
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.chargerLabel}>{c.typeLabel}</Text>
                  <Text style={[styles.chargerSub, {marginLeft: 14}]}>
                    {c.speedLabel}
                  </Text>
                </View>

                {/* 사용 가능 현황 */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={[
                        c.available === 0
                          ? styles.unavailable
                          : styles.chargerStatus,
                      ]}>
                      {c.available === 0 ? '0대' : `${c.available}대`}
                    </Text>

                    {/* 0일 때는 "/총대수" 그대로 유지 */}
                    <Text style={styles.chargerTotal}> / {c.total}대</Text>
                  </View>
                </View>
              </View>

              {index < chargerList.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        {/* 🔵 필터 버튼 */}
        <View style={styles.filterRow}>
          <SelectableButton
            label={<Text style={{fontSize: 11, lineHeight: 14}}>식당</Text>}
            selected={category === 'FD6'}
            onPress={() => setCategory(category === 'FD6' ? '' : 'FD6')}
            style={styles.filterItem}
          />

          <SelectableButton
            label={<Text style={{fontSize: 11, lineHeight: 14}}>카페</Text>}
            selected={category === 'CE7'}
            onPress={() => setCategory(category === 'CE7' ? '' : 'CE7')}
            style={styles.filterItem}
          />

          <SelectableButton
            label={<Text style={{fontSize: 11, lineHeight: 14}}>편의점</Text>}
            selected={category === 'CS2'}
            onPress={() => setCategory(category === 'CS2' ? '' : 'CS2')}
            style={styles.filterItem}
          />

          <SelectableButton
            label={<Text style={{fontSize: 11, lineHeight: 14}}>문화시설</Text>}
            selected={category === 'CT1'}
            onPress={() => setCategory(category === 'CT1' ? '' : 'CT1')}
            style={styles.filterItem}
          />
          <SelectableButton
            label={<Text style={{fontSize: 11, lineHeight: 14}}>병원</Text>}
            selected={category === 'HP8'}
            onPress={() => setCategory(category === 'HP8' ? '' : 'HP8')}
            style={styles.filterItem}
          />
        </View>

        {/* 🔽 확장 영역 */}
        {showMore && (
          <View style={styles.moreList}>
            <SelectableButton
              label={
                <Text style={{fontSize: 11, lineHeight: 14}}>관광명소</Text>
              }
              selected={category === 'AT4'}
              onPress={() => setCategory(category === 'AT4' ? '' : 'AT4')}
              style={styles.moreItem}
            />
            <SelectableButton
              label={
                <Text style={{fontSize: 11, lineHeight: 14}}>공공기관</Text>
              }
              selected={category === 'PO3'}
              onPress={() => setCategory(category === 'PO3' ? '' : 'PO3')}
              style={styles.moreItem}
            />
            <SelectableButton
              label={
                <Text style={{fontSize: 11, lineHeight: 14}}>숙박시설</Text>
              }
              selected={category === 'AD5'}
              onPress={() => setCategory(category === 'AD5' ? '' : 'AD5')}
              style={styles.moreItem}
            />
            <SelectableButton
              label={
                <Text style={{fontSize: 11, lineHeight: 14}}>대형마트</Text>
              }
              selected={category === 'MT1'}
              onPress={() => setCategory(category === 'MT1' ? '' : 'MT1')}
              style={styles.moreItem}
            />
            <SelectableButton
              label={<Text style={{fontSize: 11, lineHeight: 14}}>은행</Text>}
              selected={category === 'BK9'}
              onPress={() => setCategory(category === 'BK9' ? '' : 'BK9')}
              style={styles.moreItem}
            />
          </View>
        )}

        <SelectableButton
          label={<Text style={{fontSize: 11, lineHeight: 14}}>더보기</Text>}
          icon={<MaterialCommunityIcons name="chevron-down" size={14} />}
          selected={showMore}
          onPress={() => setShowMore(!showMore)}
          style={styles.filterItem}
        />

        <Text style={styles.sectionTitle}>주변식당</Text>
        <View style={[styles.divider, {marginTop: -3}]} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}>
        <View style={styles.cardList}>
          {places.length === 0 ? (
            <LoadingAnimation size={300} />
          ) : (
            filteredPlaces.map((p, idx) => (
              <PlaceItem
                key={idx}
                name={p.placeName}
                address1={p.placeAddress}
                address2={p.placeAddressDetail}
                phone={p.placePhone}
                onPressKakao={() => openKakaoMap(p.placeAddress)}
                onPressNaver={() => openNaverMap(p.placeAddress)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9FAFB'},
  fixedContent: {padding: 20, paddingBottom: 0, paddingTop: 10},
  headerRow: {flexDirection: 'row', justifyContent: 'space-between'},
  mapColumn: {alignItems: 'flex-end', marginRight: -11},
  headerMapButton: {
    width: 95,
    height: 34,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    elevation: 2,
  },
  mapButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMapIcon: {width: 16, height: 16, marginRight: 6},
  headerMapButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    elevation: 2,
  },
  title: {fontSize: 24, fontWeight: '700', marginBottom: 6, color: '#111'},
  address: {
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -5,
    marginTop: 5,
  },
  company: {fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#111'},
  chargerCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    elevation: 3,
    marginBottom: 15,
  },
  chargerRow: {flexDirection: 'row', alignItems: 'center'},
  chargerLabel: {fontSize: 16, fontWeight: '700', color: '#111'},
  chargerSub: {fontSize: 13, color: '#666'},
  unavailable: {fontSize: 15, fontWeight: '700', color: '#DC2626'},
  chargerTotal: {fontSize: 15, color: '#6B7280'},
  divider: {height: 1, backgroundColor: '#E5E7EB', marginVertical: 3},
  filterRow: {flexDirection: 'row', marginBottom: 10},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
    color: '#111',
  },
  scrollArea: {flex: 1, paddingHorizontal: 20},
  cardList: {gap: 14, paddingTop: 10},
  filterRow: {flexDirection: 'row', marginBottom: 10},
  filterItem: {marginRight: 5, height: 40, justifyContent: 'center'},
  moreList: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  moreItem: {marginRight: 5, marginBottom: 10, height: 40},
  unavailable: {fontSize: 16, fontWeight: '700', color: '#DC2626'}, // 빨강
  chargerStatus: {fontSize: 16, fontWeight: '700', color: '#16A34A'}, // 초록
});
