import React, {useRef, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function MusicPreview({track, onClose, onNext}) {
  const webviewRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!track?.musicPreviewUrl) return null;

  const html = `
    <html>
      <body>
        <audio id="player" src="${track.musicPreviewUrl}" autoplay></audio>
        <script>
          const audio = document.getElementById('player');
          document.addEventListener('message', e => {
            if (e.data === 'play') audio.play();
            if (e.data === 'pause') audio.pause();
          });
        </script>
      </body>
    </html>
  `;

  const togglePlay = () => {
    webviewRef.current?.postMessage(isPlaying ? 'pause' : 'play');
    setIsPlaying(prev => !prev);
  };

  return (
    <View style={styles.wrapper}>
      {/* ▶️ 미니 플레이어 UI */}
      <View style={styles.player}>
        {/* 앨범 아트 */}
        <Image source={{uri: track.musicImagePath}} style={styles.thumb} />

        <View style={styles.info}>
          <Text style={styles.title}>{track.musicTitle}</Text>
          <Text style={styles.artist}>{track.musicSinger}</Text>
        </View>

        {/* 컨트롤 버튼 */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlay} style={styles.iconBtn}>
            <MaterialIcons
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={26}
              color="#004E89"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onNext} style={styles.iconBtn}>
            <MaterialIcons name="skip-next" size={26} color="#004E89" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <MaterialIcons name="close" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔥 WebView는 아래에 두되 높이만 최소화 */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          source={{html}}
          originWhitelist={['*']}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          scrollEnabled={false}
          style={styles.webview}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  player: {
    height: 80,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    elevation: 25,
    zIndex: 10,
  },

  thumb: {
    width: 42,
    height: 42,
    borderRadius: 6,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
  },

  artist: {
    fontSize: 12,
    color: '#666',
  },

  controls: {
    flexDirection: 'row',
  },

  iconBtn: {
    paddingHorizontal: 8,
  },

  /** 🔥 WebView를 UI에 영향 없게 보관하는 핵심 */
  webviewContainer: {
    height: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },

  webview: {
    height: 1,
    opacity: 1, // 숨기지 않지만 UI 영향 없음
  },
});

export default MusicPreview;
