import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectableButton from '../../components/common/SelectableButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../../components/common/Button';
import {getFortune} from '../../utils/FortuneApi';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import DatePicker from 'react-native-date-picker';

export default function FortuneMainScreen({navigation}) {
  //라디오버튼 useState
  const [gender, setGender] = useState('');
  const [calendarTypeSelector, setCalendarTypeSelector] = useState('');
  const [type, setType] = useState('saju');

  //Piker 관련 useState
  const [openBirthPicker, setOpenBirthPicker] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthTime, setBirthTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  //drodown
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({top: 0, left: 0, width: 150});

  //Detail 랜더링
  const [showDetail, setShowDetail] = useState(false);
  const [fortuneResult, setFortuneResult] = useState('');
  const [loading, setLoading] = useState(false);

  const openDropdown = () => {
    dropdownRef.current.measure((fx, fy, width, height, px, py) => {
      setDropdownPos({top: py + height + 4, left: px, width});
      setShowTimePicker(true);
    });
  };

  //생년월일 datePiker 함수
  const onChangeBirthDate = (event, selectedDate) => {
    setShowDatePicker(false);

    if (event.type === 'dismissed') {
      return;
    }

    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const formatDate = date =>
    date ? date.toISOString().split('T')[0] : '연도-월-일';

  const formattedResult = fortuneResult.replace(/\\n/g, '\n');

  //태어난 시 Piker 함수
  const timeOptions = [
    {label: '모름', value: 'dontknow'},
    {label: '자시 (23~01시)', value: '子'},
    {label: '축시 (01~03시)', value: '丑'},
    {label: '인시 (03~05시)', value: '寅'},
    {label: '묘시 (05~07시)', value: '卯'},
    {label: '진시 (07~09시)', value: '辰'},
    {label: '사시 (09~11시)', value: '巳'},
    {label: '오시 (11~13시)', value: '午'},
    {label: '미시 (13~15시)', value: '未'},
    {label: '신시 (15~17시)', value: '申'},
    {label: '유시 (17~19시)', value: '酉'},
    {label: '술시 (19~21시)', value: '戌'},
    {label: '해시 (21~23시)', value: '亥'},
  ];

  const handleSubmit = async () => {
    if (!gender || !calendarTypeSelector || !birthDate || !birthTime || !type) {
      alert('모든 항목을 선택해주세요!');
      return;
    }

    const payload = {
      type:
        type === 'saju'
          ? 'saju'
          : type === 'daily'
          ? 'today'
          : type === 'chinese'
          ? 'zodiac'
          : type === 'odiac'
          ? 'star'
          : '',

      gender: gender === 'male' ? '남성' : '여성',

      birth: birthDate.toISOString().split('T')[0],

      birthTime:
        birthTime?.value === 'dontknow' ? '모름' : birthTime?.label || '모름',

      calendar:
        calendarTypeSelector === 'Solar'
          ? '양력'
          : calendarTypeSelector === 'Lunar'
          ? '음력'
          : '',
    };

    console.log('📤 Fortune payload:', payload);

    try {
      setLoading(true);
      setShowDetail(true);

      const result = await getFortune(payload);
      console.log('📥 Fortune result:', result);

      setFortuneResult(result);
      setShowDetail(true); // 디테일 열기
    } catch (e) {
      console.log('❌ 운세 조회 오류:', e);
      alert('운세 생성 실패 😥');
    } finally {
      setLoading(false); // 🔥 항상 로딩 종료
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 40}}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons
            name="star-four-points-outline"
            size={24}
            color="#004E89"
            style={{marginRight: 8}}
          />
          <Text style={styles.headerTitle}>오늘의 운세</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.contentCard}>
          {/* 성별 & 양/음력 */}
          <View style={styles.firstRow}>
            <View style={styles.gender}>
              <Text style={styles.genderText}>성별</Text>
              <View style={styles.genderWrapper}>
                <SelectableButton
                  label={<Text style={{fontSize: 11}}>남자</Text>}
                  selected={gender === 'male'}
                  onPress={() => setGender(gender === 'male' ? '' : 'male')}
                  style={styles.genderButton}
                />
                <SelectableButton
                  label={<Text style={{fontSize: 11}}>여자</Text>}
                  selected={gender === 'female'}
                  onPress={() => setGender(gender === 'female' ? '' : 'female')}
                  style={[styles.genderButton, {marginLeft: 5}]}
                />
              </View>
            </View>

            <View style={styles.calendarTypeSelector}>
              <Text style={styles.calendarTypeSelectorText}>양력/음력</Text>
              <View style={styles.calendarTypeSelectorWrapper}>
                <SelectableButton
                  label={<Text style={{fontSize: 11}}>양력</Text>}
                  selected={calendarTypeSelector === 'Solar'}
                  onPress={() =>
                    setCalendarTypeSelector(
                      calendarTypeSelector === 'Solar' ? '' : 'Solar',
                    )
                  }
                  style={styles.calendarTypeSelectorButton}
                />
                <SelectableButton
                  label={<Text style={{fontSize: 11}}>음력</Text>}
                  selected={calendarTypeSelector === 'Lunar'}
                  onPress={() =>
                    setCalendarTypeSelector(
                      calendarTypeSelector === 'Lunar' ? '' : 'Lunar',
                    )
                  }
                  style={[styles.calendarTypeSelectorButton, {marginLeft: 5}]}
                />
              </View>
            </View>
          </View>

          {/* 생년월일 & 태어난 시 */}
          <View style={styles.secondRow}>
            {/* 생년월일 */}
            {/* 생년월일 */}
            <View style={styles.birth}>
              <Text style={styles.birthText}>생년월일</Text>

              <Pressable
                style={styles.birthWrapper}
                onPress={() => setOpenBirthPicker(true)}>
                <Text style={{color: '#111', fontSize: 13, fontWeight: '500'}}>
                  {birthDate
                    ? birthDate.toISOString().split('T')[0]
                    : '연도-월-일'}
                </Text>
                <MaterialCommunityIcons
                  name="calendar"
                  size={18}
                  color="#004E89"
                />
              </Pressable>

              {/* 📌 생년월일 모달 DatePicker */}
              <DatePicker
                modal
                open={openBirthPicker}
                date={birthDate}
                mode="date"
                locale="ko"
                title="생년월일 선택"
                confirmText="확인"
                cancelText="취소"
                onConfirm={date => {
                  setOpenBirthPicker(false);
                  setBirthDate(date);
                }}
                onCancel={() => {
                  setOpenBirthPicker(false);
                }}
              />
            </View>

            {/* 태어난 시 */}
            <View style={styles.birthTime}>
              <Text style={styles.birthTimeText}>태어난 시</Text>
              <TouchableOpacity
                ref={dropdownRef}
                style={styles.timeWrapper}
                onPress={openDropdown}>
                <Text style={styles.timeText}>
                  {birthTime?.label || '선택하세요'}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={18}
                  color="#004E89"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{height: 20}} />
        <View style={styles.contentCard}>
          <Text style={styles.contentHeader}>운세 종류</Text>
          <View style={styles.typeButtonWrapper}>
            <SelectableButton
              label={<Text style={{fontSize: 11}}>사주</Text>}
              selected={type === 'saju'}
              onPress={() => setType(type === 'saju' ? '' : 'saju')}
              style={styles.genderButton}
            />
            <SelectableButton
              label={<Text style={{fontSize: 11}}>오늘의 운세</Text>}
              selected={type === 'daily'}
              onPress={() => setType(type === 'daily' ? '' : 'daily')}
              style={[styles.genderButton, {marginLeft: 5}]}
            />
            <SelectableButton
              label={<Text style={{fontSize: 11}}>띠별 운세</Text>}
              selected={type === 'chinese'}
              onPress={() => setType(type === 'chinese' ? '' : 'chinese')}
              style={[styles.genderButton, {marginLeft: 5}]}
            />
            <SelectableButton
              label={<Text style={{fontSize: 11}}>별자리 운세</Text>}
              selected={type === 'odiac'}
              onPress={() => setType(type === 'odiac' ? '' : 'odiac')}
              style={[styles.genderButton, {marginLeft: 5}]}
            />
          </View>
        </View>
      </View>

      <Button
        type="submit"
        text="운세보기"
        width={'90%'}
        style={{
          marginTop: 15,
          alignSelf: 'center',
        }}
        onPress={handleSubmit}
      />
      {/* 운세 디테일 영역
       */}
      {showDetail && (
        <View style={styles.detailCard}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="star-four-points-outline"
              size={20}
              color="#004E89"
              style={{marginRight: 6}}
            />
            <Text style={styles.detailTitle}>운세 결과</Text>
          </View>

          {/* 🔥 로딩 중일 때는 스피너 표시 */}
          {loading ? (
            <View style={{paddingVertical: 40}}>
              <LoadingAnimation />
            </View>
          ) : (
            <ScrollView
              style={{maxHeight: 350, marginTop: 12}}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.fortuneResultText}>{formattedResult}</Text>
            </ScrollView>
          )}
        </View>
      )}

      {/* 🔥 드롭다운 모달 */}
      <Modal visible={showTimePicker} transparent animationType="fade">
        <View style={styles.modalContainer}>
          {/* 바깥 터치 시 닫힘 */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setShowTimePicker(false)}
            activeOpacity={1}
          />

          {/* 실제 드롭다운 박스 */}
          <View
            style={[
              styles.dropdownBox,
              {
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
              },
            ]}>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}>
              {timeOptions.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.timeOption,
                    birthTime?.value === item.value &&
                      styles.timeOptionSelected,
                  ]}
                  onPress={() => {
                    setBirthTime(item);
                    setShowTimePicker(false);
                  }}>
                  <Text style={{fontSize: 14}}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9FAFB'},
  pageHeader: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  headerTitleContainer: {flexDirection: 'row', alignItems: 'center'},
  headerTitle: {fontSize: 22, fontWeight: 'bold', color: '#111'},

  content: {alignItems: 'center', marginTop: 10},
  contentCard: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  firstRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  gender: {width: '45%'},
  genderText: {fontSize: 13, fontWeight: 'bold', color: '#111'},
  genderWrapper: {flexDirection: 'row', marginTop: 10},
  genderButton: {
    minWidth: 60,
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarTypeSelector: {width: '45%'},
  calendarTypeSelectorText: {fontSize: 13, fontWeight: 'bold', color: '#111'},
  calendarTypeSelectorWrapper: {flexDirection: 'row', marginTop: 10},
  calendarTypeSelectorButton: {
    minWidth: 60,
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  birth: {width: '45%'},
  birthText: {fontSize: 13, fontWeight: 'bold', color: '#111'},
  birthWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    height: 32,
    paddingHorizontal: 14,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  birthTime: {width: '45%'},
  birthTimeText: {fontSize: 13, fontWeight: 'bold', color: '#111'},
  birthTimeWrapper: {
    flexDirection: 'row',
    marginTop: 7,
    overflow: 'visible',
  },

  timeWrapper: {
    flexDirection: 'row',
    width: 135,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    height: 32,
    paddingHorizontal: 14,

    // 🔥 추가
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeText: {fontSize: 13, fontWeight: '500', color: '#111'},

  timePickerContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    width: 150,
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 9999,
  },
  timeOption: {paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8},
  timeOptionSelected: {backgroundColor: '#E5F1FB'},
  modalBackdrop: {
    flex: 1,
  },
  dropdownBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    maxHeight: 220,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 15,
    paddingVertical: 6,
    zIndex: 9999,
  },
  contentHeader: {fontSize: 13, fontWeight: 'bold', color: '#111'},

  typeButtonWrapper: {flexDirection: 'row', marginTop: 10},
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  detailCard: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 15,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // height를 강제해도 OK
    // height: 420,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004E89',
    marginBottom: 6,
  },

  fortuneResultText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
});