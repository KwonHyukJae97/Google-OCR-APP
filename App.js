import axios from 'axios';
import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Loading from './Loading';

const API_URL = 'https://vision.googleapis.com/v1/images:annotate?key=';
const API_KEY = 'AIzaSyAQ2yQsWabcUU8ZImh-JVjjXShrgKoqNso';

const App = () => {
  const [text, setText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    if (text.length != 0) {
      setIsLoading(true);
      console.log('ㅁㅁㅃㅉㅇㅇㄴ', text);
    }
  }, [text]);

  const callGoogleVIsionApi = async base => {
    const apiCall = `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAQ2yQsWabcUU8ZImh-JVjjXShrgKoqNso`;

    const reqObj = {
      requests: [
        {
          image: {
            content: base,
          },
          features: [
            {
              type: 'DOCUMENT_TEXT_DETECTION',
            },
          ],
        },
      ],
    };

    axios
      .post(apiCall, reqObj)
      .then(response => {
        // console.log(JSON.stringify(response.data.responses));
        const result = response.data.responses[0].fullTextAnnotation.text;
        console.log('사진 텍스트 추출 데이터', result);
        setText(result);
      })
      .catch(e => {
        console.log(e.response);
        alert('OCR 인식에 실패했습니다. 직접 입력해주세요!');
      });
  };

  const cameraLaunch = () => {
    let options = {
      mediaType: 'photo',
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchCamera(options, res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        callGoogleVIsionApi(res.assets[0].base64);
        setIsClick(true);
        // setTimeout(() => {
        //   setText(dummyText);
        // }, 5000);
        setIsLoading(false);
      }
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.header}>Google Vision OCR 테스트앱</Text>
          {isClick ? (
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollContainer}>
              {isLoading && text.length != 0 ? (
                <>
                  <Text style={styles.text}>{text}</Text>
                </>
              ) : (
                <Loading />
              )}
            </ScrollView>
          ) : null}
          <TouchableOpacity onPress={cameraLaunch} style={styles.button}>
            <Text style={styles.buttonText}>사진 찍기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  scrollContainer: {
    backgroundColor: '#ECECEC',
    width: '80%',
    padding: 24,
    marginBottom: 30,
    borderRadius: 20,
  },

  text: {
    color: 'black',
    fontSize: 18,
  },

  button: {
    width: 250,
    height: 60,
    backgroundColor: '#3740ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 12,
  },
  header: {
    // backgroundColor: 'red',
    color: 'black',
    fontSize: 21,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 20,
  },

  screen: {
    // backgroundColor: 'yellow',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
  },
});

export default App;
