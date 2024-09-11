import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, ImageBackground, Keyboard, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
    interface Course {
        id: number;
        course: string;
        credits: number;
        grade: number;
    }
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [courseInput, setCourseInput] = useState('')
    const [creditsInput, setCreditsInput] = useState('')
    const [gradeInput, setGradeInput] = useState('');
    const [gpa, setGpa] = useState(0);

    const courseRef = useRef<TextInput | null>(null);
    const creditsRef = useRef<TextInput | null>(null);
    const gradeRef = useRef<TextInput | null>(null);

    useEffect(() => {
        const totalGrade = courseList.reduce((result, current) => result + current.credits * current.grade, 0);
        const numberOfCredits = courseList.reduce((result, current) => result + current.credits, 0);
        setGpa(totalGrade / numberOfCredits);
    }, [courseList])

    useEffect(() => {
        const loadStoredDataRead = async () => {
            await getData();
        };
        loadStoredDataRead();
    }, [])
    const handleDeleteCourse = (id: number): void => {
        setCourseList(pre => {
            const newList = pre.filter(item => item.id !== id);
            storeData(newList);
            return newList;
        });
    }

    const handleSubmitAddCourse = (): void => {
        if (courseInput === '') {
            Alert.alert(
                'Lost in Class?',
                'Oops! Forgot to name your course? Give it a title before you submit!',
                [
                    { text: 'OK Babe' },
                ],
                { cancelable: false }
            )
            courseRef.current.focus()
            return;
        } else if (creditsInput === '') {
            Alert.alert(
                'Credits Gone Missing?',
                'Wait! No credits? Add them before you hit submit, genius!',
                [
                    { text: 'OK Babe' },
                ],
                { cancelable: false }
            )
            creditsRef.current.focus()
            return;
        } else if (gradeInput === '') {
            Alert.alert(
                'Grade? What Grade?',
                "No grade, no glory! Don't forget to add your grade before submitting!",
                [
                    { text: 'OK Babe' },
                ],
                { cancelable: false }
            )
            gradeRef.current.focus()
            return;
        }

        setCourseList(pre => {
            const newList = [
                ...pre,
                {
                    id: Date.now(),
                    course: courseInput,
                    credits: parseFloat(creditsInput),
                    grade: parseFloat(gradeInput)
                }
            ]
            storeData(newList);
            return newList
        })
        setCourseInput('');
        setCreditsInput('');
        setGradeInput('');
        Keyboard.dismiss();
    }

    const storeData = (newCourseList: Course[]): void => {

        const loadStoredData = async () => {
            try {
                await AsyncStorage.setItem('course-list', JSON.stringify(newCourseList));
            } catch (err) {
                console.error(err);
            }
        }
        loadStoredData();
    };
    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('course-list');
            if (jsonValue) {
                setCourseList(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error('invalid storage when reading');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#000"
                translucent={true} 
            />
            <ImageBackground source={require('./assets/background.jpg')} resizeMode="cover" blurRadius={5} style={styles.imageBackground} />
            <View style={styles.appHeader}>
                <Text style={styles.headerTitle}>GPA Calculator</Text>
            </View>
            <View style={styles.inputCourseBox}>
                <View style={styles.inputGroup}>
                    <Text style={styles.lableInput}>Course</Text>
                    <TextInput
                        style={styles.inputTag}
                        ref={courseRef}
                        value={courseInput}
                        onChangeText={(text) => setCourseInput(text)}
                        inputMode="text"
                        onSubmitEditing={() => creditsRef.current.focus()}
                    />
                </View>
                <View style={styles.inputGroup} >
                    <Text style={styles.lableInput} >Credits</Text>
                    <TextInput
                        style={styles.inputTag}
                        ref={creditsRef}
                        value={creditsInput}
                        onChangeText={(text) => setCreditsInput(text)}
                        inputMode="numeric"
                        onSubmitEditing={() => gradeRef.current.focus()}
                    />
                </View>
                <View style={styles.inputGroup} >
                    <Text style={styles.lableInput} >Grade</Text>
                    <TextInput
                        style={styles.inputTag}
                        ref={gradeRef}
                        value={gradeInput}
                        onChangeText={(text) => setGradeInput(text)}
                        inputMode="numeric"
                    />
                </View>
                <Pressable
                    style={styles.btnTag}
                    onPress={() => handleSubmitAddCourse()}
                >
                    <Text style={styles.textInsideButtonAdd}>Add Course</Text>
                </Pressable>
            </View>
            <ScrollView style={styles.displayCourseList}>
                <Text style={styles.courseListTitle}>Course List</Text>
                <View>
                    <View style={styles.tableRows}>
                        <Text style={styles.tableCol1}>Course</Text>
                        <Text style={styles.tableCol2}>Credits</Text>
                        <Text style={styles.tableCol3}>Grade</Text>
                        <Text style={styles.tableCol4}>Action</Text>
                    </View>
                    {courseList && courseList.length ? courseList.map((item, index) => (
                        <View key={index} style={styles.tableRows}>
                            <Text style={styles.tableCol1} >{item.course}</Text>
                            <Text style={styles.tableCol2} >{item.credits}</Text>
                            <Text style={styles.tableCol3} >{item.grade}</Text>
                            <Text style={styles.tableCol4} onPress={() => handleDeleteCourse(item.id)}>
                                <MaterialIcons style={styles.deleteIcon} name="delete-forever" size={24} color="black" />
                            </Text>
                        </View>
                    )) : (
                        <View>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: '500',
                                paddingVertical: 20
                            }}>Have no record</Text>
                        </View>
                    )
                    }
                </View>
                <Text style={styles.gpa}>GPA: {gpa ? gpa.toFixed(2) : '0'}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'red'

    },
    imageBackground: {
        // width: '110%',
        // height: '100%',
        position: "absolute",
        backgroundColor: 'green',
        zIndex: -1,
        left: 0,
        top: 0,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,

    },
    appHeader: {
        marginTop: 40,
        width: '100%',
        height: 80,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: "700",
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {
            width: 0,
            height: 0
        },
        textShadowRadius: 3,

    },
    inputCourseBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        paddingHorizontal: 30,
        paddingVertical: 30,
        borderRadius: 10,
        overflow: 'hidden',
        rowGap: 10,
    },
    inputGroup: {
        width: '100%',
    },
    lableInput: {
        color: '#444',
        marginBottom: 2,

    },
    inputTag: {
        color: '#444',
        borderColor: '#aaa',
        borderWidth: 1,
        width: '100%',
        height: 50,
        paddingHorizontal: 15,
        fontSize: 17,
        lineHeight: 50,

    },
    btnTag: {
        backgroundColor: 'rgba(120, 120, 120, 0.3)',
        height: 50,
        borderWidth: 1,
        borderColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,

    },
    textInsideButtonAdd: {
        color: '#fff',
        fontSize: 17,
        lineHeight: 20,
        textShadowColor: 'rgba(255, 255, 255, 0.9)',
        textShadowOffset: {
            height: 0,
            width: 0
        },
        textShadowRadius: 5
    },
    displayCourseList: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 10,
        marginTop: 20,
        paddingHorizontal: 30,
        marginBottom: 30,
    },
    courseListTitle: {
        textAlign: 'center',
        fontSize: 23,
        lineHeight: 23,
        fontWeight: '600',
        paddingTop: 20,
    },
    tableRows: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomColor: '#888',
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    tableCol1: {
        flex: 1,
        textAlign: 'center'
    },
    tableCol2: {
        width: 60,
        textAlign: 'center',
    },
    tableCol3: {
        width: 60,
        textAlign: 'center',
    },
    tableCol4: {
        width: 60,
        textAlign: 'center',
    },
    deleteIcon: {
        color: '#F36565'
    },
    gpa: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
        paddingBottom: 20,
    },
})