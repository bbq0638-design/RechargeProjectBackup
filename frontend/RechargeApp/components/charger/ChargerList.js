import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ChargerItem from './ChargerItem';

function ChargerListInner(
  {data = [], count = 0, selectedStationId, onPressItem},
  ref,
) {
  const listRef = useRef(null);

  // 부모(ChargerMainScreen)에서 scrollToIndex 호출할 수 있게 열어줌
  useImperativeHandle(ref, () => ({
    scrollToIndex: params => {
      listRef.current?.scrollToIndex(params);
    },
  }));

  const renderItem = ({item}) => {
    return (
      <ChargerItem
        item={item}
        selected={
          String(item.stationId).trim() === String(selectedStationId).trim()
        }
        onPress={() => onPressItem(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(182,182,182,0.12)', 'rgba(182,182,182,0.12)']}
        style={styles.gradient}
      />

      <View style={styles.wrapper}>
        <View style={styles.header} />
        <Text style={styles.title}>주변 충전소 ({count})</Text>

        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item, index) =>
            item.stationId ? String(item.stationId) : String(index)
          }
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 30, paddingTop: 4}}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={info => {
            // 1차: 대략적 위치로 먼저 이동
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: false, // 🚫 애니메이션 끔 (무한루프 방지 핵심)
            });

            // 2차 정확한 위치 이동
            setTimeout(() => {
              // 👇 이미 렌더된 후에만 실행
              if (listRef.current && data[info.index]) {
                listRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0.1,
                });
              }
            }, 50);
          }}
        />
      </View>
    </View>
  );
}

const ChargerList = forwardRef(ChargerListInner);
export default ChargerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },

  gradient: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 0,
    borderRadius: 30,
  },

  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: -4},
    shadowRadius: 18,
    elevation: 10,
    zIndex: 2,
  },

  header: {
    width: 100,
    height: 7,
    alignSelf: 'center',
    backgroundColor: '#f0efef',
    marginBottom: 20,
    borderRadius: 30,
    elevation: 0.5,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#111827',
    textAlign: 'center',
  },
});
