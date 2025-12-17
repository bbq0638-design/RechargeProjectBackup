import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

export default function ChargerItem({item, selected, onPress}) {
  // 🔹 타입 매핑
  const chargerTypeMap = {
    '01': 'DC차데모',
    '02': 'AC완속',
    '03': 'DC차데모+AC3상',
    '04': 'DC콤보',
    '05': 'DC차데모+DC콤보',
    '06': 'DC복합 ',
    '07': 'AC3상',
    '08': 'DC콤보(완속)',
    '09': 'NACS',
    10: 'DC콤보+NACS',
    11: 'DC콤보2 (버스전용)',
  };

  // 🔹 속도 분류
  const getSpeedLabel = speed => {
    const s = Number(speed);
    if (s <= 7) return '완속';
    if (s >= 150) return '급속';
    return '중속';
  };

  const {
    stationName,
    stationAddress,
    stationAddressDetail,
    chargerTotal,
    chargerAvailable,
    chargerTypes,
    chargerSpeeds,
    chargerProviders,
  } = item;

  const rawDistance = item.distance ?? '0';
  const distanceKm = Number(rawDistance).toFixed(2);

  const fullAddress = `${stationAddress ?? ''} ${
    stationAddressDetail ?? ''
  }`.trim();

  // 🔥 문자열 → 배열 변환
  const types = chargerTypes ? chargerTypes.split(',').map(t => t.trim()) : [];
  const speeds = chargerSpeeds
    ? chargerSpeeds.split(',').map(s => s.trim())
    : [];

  // 🔥 타입과 속도 매칭
  const chargerPairs = types.map((t, i) => ({
    type: t,
    speed: speeds[i] || '',
  }));

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.card, selected && styles.selectedCard]}>
        {/* 이름 + 거리 */}
        <View style={styles.rowBtween}>
          <Text style={styles.title}>{stationName}</Text>
          <Text style={styles.distance}>{distanceKm} km</Text>
        </View>
        {/* 주소 */}
        <View style={styles.row}>
          <Text style={styles.address}>{fullAddress}</Text>
        </View>
        {/* 회사명 임시 */}
        {(() => {
          const providers = item.chargerProviders
            ? item.chargerProviders.split(',').map(p => p.trim())
            : [];

          // 🔹 중복 제거된 회사명 배열
          const uniqueProviders = [...new Set(providers)];

          return (
            <Text style={styles.company}>
              {uniqueProviders.join(', ')}{' '}
              {/* 필요하면 첫 번째만: uniqueProviders[0] */}
            </Text>
          );
        })()}

        {/* 타입 표시 */}
        {(() => {
          const countMap = new Map();
          const displayList = [];

          chargerPairs.forEach(cp => {
            const typeLabel = chargerTypeMap[cp.type] ?? cp.type;
            const speedLabel = cp.speed ? getSpeedLabel(cp.speed) : '';
            const displayText = `${typeLabel} ${
              cp.speed ? `(${cp.speed}kW · ${speedLabel})` : ''
            }`;

            // 개수 카운트
            countMap.set(displayText, (countMap.get(displayText) || 0) + 1);
          });

          // 중복 제거 된 리스트 생성
          countMap.forEach((count, key) => {
            displayList.push({text: key, count});
          });

          return displayList.map((item, index) => (
            <Text key={index} style={styles.types}>
              {item.text}
              {item.count > 1 && ` (${item.count}개)`}
            </Text>
          ));
        })()}
        {/* 사용 가능 표시 */}
        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.available,
              chargerAvailable === 0
                ? styles.unavailable
                : chargerAvailable < chargerTotal * 0.5
                ? styles.crowded
                : styles.free,
            ]}>
            {chargerAvailable}/{chargerTotal}{' '}
            {chargerAvailable === 0
              ? '사용불가'
              : chargerAvailable < chargerTotal * 0.5
              ? '혼잡'
              : '사용가능'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bebebeff',
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: '#004E89',
    elevation: 8,
  },

  rowBtween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#4B5563',
  },
  company: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
    marginBottom: 6,
  },
  types: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    fontWeight: '600',
  },
  bottomRow: {
    width: '100%',
    marginTop: 8,
  },
  available: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '700',
  },
  unavailable: {
    color: '#DC2626',
  },
  crowded: {
    color: '#EA580C',
  },
  free: {
    color: '#16A34A',
  },
});
