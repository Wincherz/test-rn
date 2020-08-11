import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, Picker } from 'react-native';
import { getUsersFromServer } from './api/api';
import debounce from 'lodash/debounce';

export default function App() {

  const [users, setUsers] = useState([]);
  const [minAge, setMinAge] = useState('0');
  const [maxAge, setMaxAge] = useState('199');
  const [userName, setUserName] = useState('');
  const [userGender, setUserGender] = useState('');

  const getData = () => {
    getUsersFromServer()
      .then(data => setUsers(data.result));
  }

  useEffect(() => {
    getData();
  }, [])

  const usersFilter = () => {
    const result = users.filter((item) => {
      const age = new Date().getYear() - new Date(item.dob).getYear();

      if (minAge === '' || maxAge === '') return true

      if (minAge === '') {
        return age <= parseInt(maxAge) && age > 0;
      } else if (maxAge === '') {
        return age >= parseInt(minAge) && age < 199;
      }

      return (
        (age >= parseInt(minAge) && age <= parseInt(maxAge))
        && (item.gender === 'female' || item.gender === 'male' || item.gender.includes(''))
      )
    })

    if (userName.length > 1) {
      return result.filter((item) => {
        return (
          item.first_name.toLowerCase().includes(userName.toLowerCase())
          || item.last_name.toLowerCase().includes(userName.toLowerCase())
        )}
      )
    } else {
      return result;
    }

  }

  const usersMemo = useMemo(
      () => usersFilter(),
      [users, minAge, maxAge, userName]
  )

  const usersFilterWithDebounce = useCallback(
      debounce(setUserName, 400),
      []
  )

  return (
    <>
      <View style={styles.containerInput}>
        <TextInput
            value={userName}
            style={styles.input}
            onChangeText={(text) => usersFilterWithDebounce(text)}
        />
        <TextInput
          value={minAge}
          style={styles.input}
          onChangeText={(text) => setMinAge(text)}
        />
        <TextInput
          style={styles.input}
          value={maxAge}
          onChangeText={(text) => setMaxAge(text)}
        />
        <Picker
            selectedValue={userGender}
            style={{ height: 50, width: 150 }}
            onValueChange={itemValue => setUserGender(itemValue)}
        >
          <Picker.Item label="choose your gender" value="" />
          <Picker.Item label="female" value="female" />
          <Picker.Item label="male" value="male" />
        </Picker>
      </View>
      <View style={styles.container}>
        {
          !!users.length
          && usersMemo.map(item => {
            const personAge = new Date().getYear() - new Date(item.dob).getYear();

            return (
              <Text
                style={styles.text}
                key={item.first_name}
              >
                {`#${item.id} - ${item.first_name} ${item.last_name} - ${personAge} year old - ${item.gender}`}
              </Text>
            )
          })
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000'
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    paddingLeft: 10,
    paddingRight: 10,
  },
  containerInput: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  }
});
