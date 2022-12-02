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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Loading from './Loading';
import ImagePicker from 'react-native-image-crop-picker';

// const API_URL = 'https://vision.googleapis.com/v1/images:annotate?key=';
// const API_KEY = 'AIzaSyAQ2yQsWabcUU8ZImh-JVjjXShrgKoqNso';

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
        alert('OCR 인식에 실패했습니다. 다시 시도해주세요!');
      });
  };

  //일반버전
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
        alert('이미지 촬영을 취소하였습니다.');
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
        alert('이미지 촬영 오류입니다. 앱을 재시작 해주세요.');
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        callGoogleVIsionApi(res.assets[0].base64);
        setIsClick(true);
        setIsLoading(false);
      }
    });
  };

  //crop 버전
  const cropCameraLaunch = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      includeBase64: true,
      width: 300,
      height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then(res => {
        callGoogleVIsionApi(res.data);
        setIsClick(true);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        alert('이미지 선택을 취소하였습니다.');
      });
  };

  //crop 버전
  const imageGalleryLaunch = () => {
    //   ImagePicker.openPicker({
    //     mediaType: 'photo',
    //     includeBase64: true,
    //     width: 300,
    //     height: 400,
    //     cropping: true,
    //     freeStyleCropEnabled: true,
    //   })
    //     .then(res => {
    //       callGoogleVIsionApi(res.data);
    //       setIsClick(true);
    //       setIsLoading(false);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       alert('이미지 선택을 취소하였습니다.');
    //     });

    //일반버전
    let options = {
      mediaType: 'photo',
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, res => {
      // console.log('Response갤러리 = ', res);
      if (res.didCancel) {
        alert('이미지 선택을 취소하였습니다.');
        console.log('User cancelled image picker');
      } else if (res.error) {
        alert(
          '알수없는 오류로 인한 갤러리에서 사진을 불러오지 못하였습니다. 앱을 재시작 해주세요.',
        );
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        callGoogleVIsionApi(res.assets[0].base64);
        setIsClick(true);
        setIsLoading(false);
      }
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.container}>
          {/* <Text style={styles.firstHeader}>Google Vision을 이용한</Text> */}
          <Text style={styles.secondHeader}>열픽 단어장 Google</Text>
          {/* <Image
            source={{
              uri: 'data:image/jpeg;base64,' + state.resourcePath.data,
            }}
            style={{width: 100, height: 100}}
          />

          <Image
            source={{uri: state.resourcePath.uri}}
            style={{width: 200, height: 200}}
          />

          <Text style={{alignItems: 'center'}}>
            {state.resourcePath.uri}
          </Text> */}
          {isClick ? (
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollContainer}>
              {isLoading && text.length != 0 ? (
                <>
                  <ScrollView>
                    <Text style={styles.text}>{text}</Text>
                  </ScrollView>
                </>
              ) : (
                <Loading />
              )}
            </ScrollView>
          ) : null}
          <TouchableOpacity onPress={cameraLaunch} style={styles.cameraButton}>
            <Text style={styles.buttonText}>일반사진 촬영</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={cropCameraLaunch}
            style={styles.cameraButton}>
            <Text style={styles.buttonText}>크롭사진 촬영</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={imageGalleryLaunch}
            style={styles.galleryButton}>
            <Text style={styles.buttonText}>갤러리 보기</Text>
          </TouchableOpacity> */}
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
    display: 'flex',
    backgroundColor: '#fff',
    width: 500,
  },

  scrollContainer: {
    backgroundColor: '#ECECEC',
    width: '81%',
    // padding: 1,
    marginBottom: 5,
    borderRadius: 3,
  },

  text: {
    color: 'black',
    fontSize: 12,
  },

  cameraButton: {
    width: 360,
    height: 60,
    // backgroundColor: '#33FFFF',
    backgroundColor: '#3740ff',
    // backgroundColor: '#777777',
    // backgroundColor: '#33FF99',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 3,
  },
  galleryButton: {
    width: 250,
    height: 60,
    // backgroundColor: '#33FFFF',
    // backgroundColor: '#3740ff',
    backgroundColor: '#777777',
    // backgroundColor: '#33FF99',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 12,
  },
  firstHeader: {
    // backgroundColor: 'red',
    color: 'black',
    fontSize: 30,
    fontWeight: '700',
    // marginTop: 1,
  },
  secondHeader: {
    // backgroundColor: 'red',
    color: 'black',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 5,
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
    fontSize: 17,
    color: '#fff',
  },
});

export default App;
