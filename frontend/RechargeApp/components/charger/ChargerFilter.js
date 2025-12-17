import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectableButton from '../common/SelectableButton';
import Button from '../common/Button';

export default function ChargerFilter({
  company = [],
  type = [],
  speed = [],
  open = '',
  wait = '',
  free,
  fast,
  slow,
  onApply,
  onClose,
  onToggleFree,
  onToggleFast,
  onToggleSlow,
}) {
  /** ---------------- 임시 상태 관리 ---------------- */
  const [tempCompany, setTempCompany] = useState(company);
  const [tempType, setTempType] = useState(type);
  const [tempSpeed, setTempSpeed] = useState(speed);
  const [tempOpen, setTempOpen] = useState(open);
  const [tempWait, setTempWait] = useState(wait);

  /** 🔄 부모 값 바뀌면 다시 반영 */
  useEffect(() => {
    setTempCompany(company);
    setTempType(type);
    setTempSpeed(speed);
    setTempOpen(open);
    setTempWait(wait);
  }, [company, type, speed, open, wait]);

  /** ---------------- UI 상태 ---------------- */
  const [companyMore, setCompanyMore] = useState(false);
  const [typeMore, setTypeMore] = useState(false);

  const EXTRA_COMPANY = [
    'SK에너지',
    '에버온',
    '차지비',
    '현대오일뱅크',
    '타디스테크놀로지',
  ];

  const EXTRA_TYPES = [
    'DC차데모+AC3상',
    'DC차데모+DC콤보',
    'DC복합',
    'AC3상',
    'DC콤보(완속)',
    'NACS',
    'DC콤보+NACS',
    'DC콤보2 (버스전용)',
  ];

  const toggleValue = (list, value) =>
    list.includes(value) ? list.filter(v => v !== value) : [...list, value];

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>필터 설정</Text>
        <Pressable onPress={onClose}>
          <MaterialCommunityIcons name="close" size={24} color="#111" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 🔌 충전기 회사 */}
        <Text style={styles.sectionTitle}>충전기 회사</Text>
        <View style={styles.rowWrap}>
          {[
            '한국전기차충전서비스',
            '한국전력공사',
            '환경부',
            'GS칼텍스',
            'LG유플러스',
          ].map(item => (
            <SelectableButton
              key={item}
              label={item}
              selected={tempCompany.includes(item)}
              onPress={() => setTempCompany(prev => toggleValue(prev, item))}
              style={styles.item}
            />
          ))}

          {companyMore &&
            EXTRA_COMPANY.map(item => (
              <SelectableButton
                key={item}
                label={item}
                selected={tempCompany.includes(item)}
                onPress={() => setTempCompany(prev => toggleValue(prev, item))}
                style={styles.item}
              />
            ))}

          <SelectableButton
            label="더보기"
            icon={
              <MaterialCommunityIcons
                name={companyMore ? 'chevron-up' : 'chevron-down'}
              />
            }
            selected={companyMore}
            onPress={() => setCompanyMore(!companyMore)}
            style={styles.item}
          />
        </View>

        {/* ⚡ 충전 타입 */}
        <Text style={styles.sectionTitle}>충전 타입</Text>
        <View style={styles.rowWrap}>
          {['DC콤보', 'AC완속', 'DC차데모'].map(item => (
            <SelectableButton
              key={item}
              label={item}
              selected={tempType.includes(item)}
              onPress={() => setTempType(prev => toggleValue(prev, item))}
              style={styles.item}
            />
          ))}

          {typeMore &&
            EXTRA_TYPES.map(item => (
              <SelectableButton
                key={item}
                label={item}
                selected={tempType.includes(item)}
                onPress={() => setTempType(prev => toggleValue(prev, item))}
                style={styles.item}
              />
            ))}

          <SelectableButton
            label="더보기"
            icon={
              <MaterialCommunityIcons
                name={typeMore ? 'chevron-up' : 'chevron-down'}
              />
            }
            selected={typeMore}
            onPress={() => setTypeMore(!typeMore)}
            style={styles.item}
          />
        </View>

        {/* 🚀 충전 속도 */}
        <Text style={styles.sectionTitle}>충전 속도</Text>
        <View style={styles.rowWrap}>
          {['급속', '중속', '완속'].map(item => (
            <SelectableButton
              key={item}
              label={item}
              selected={tempSpeed.includes(item)}
              onPress={() => setTempSpeed(prev => toggleValue(prev, item))}
              style={styles.item}
            />
          ))}
        </View>

        {/* 🔓 개방 여부 */}
        <Text style={styles.sectionTitle}>개방 여부</Text>
        <View style={styles.rowWrap}>
          <SelectableButton
            label="무료"
            selected={tempOpen === '무료'}
            onPress={() => setTempOpen(prev => (prev === '무료' ? '' : '무료'))}
            style={styles.item}
          />
        </View>

        {/* 🚫 대기 여부 */}
        <Text style={styles.sectionTitle}>대기 여부</Text>
        <View style={styles.rowWrap}>
          <SelectableButton
            label="대기없음"
            selected={tempWait === '대기없음'}
            onPress={() =>
              setTempWait(prev => (prev === '대기없음' ? '' : '대기없음'))
            }
            style={styles.item}
          />
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={[styles.footer, {paddingHorizontal: 10}]}>
        <Button
          type="cancel"
          text="취소"
          onPress={onClose}
          height={50}
          style={{flex: 1, marginRight: 10}}
        />

        <Button
          type="submit"
          text="적용하기"
          onPress={() =>
            onApply(tempCompany, tempType, tempSpeed, tempOpen, tempWait)
          }
          height={50}
          style={{flex: 1}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 0,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 15,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    marginRight: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
});
