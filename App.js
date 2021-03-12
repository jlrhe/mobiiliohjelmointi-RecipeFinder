import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput, FlatList, Image, Linking } from 'react-native';

export default function App() {
  const [incredient, setIncredient] = useState('');
  const [recipes, setRecipes] = useState([]);

  const getRecipes = () => {
    const url = 'http://www.recipepuppy.com/api/?i='+ incredient; //selaimessa testatessa localhostin kautta CORS "vähän" hämäsi... 
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 
       setRecipes(responseJson);
    })
    .catch((error) => { 
      Alert.alert("Error:" , error.message); //mielenkiintoisesti "bacon" hakusana antaa 404-sivun, eikä tyhjää JSON:ia, kuten olettaisi
      setIncredient(""); 
    }); 
  }
  
  const listSeparator = () => {
    return (
      <View
        style={{
          height: 3,
          width: "100%",
          backgroundColor: "#333",
        }}
      />
    );
  };

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      
        await Linking.openURL(url);
      
    }, [url]);
  
    return <Button title={children} onPress={handlePress} />;
  };

  return (
    <View style={styles.container}>
      <FlatList 
        data={recipes.results}
        style={styles.results}
        keyExtractor={item => item.href} //href näyttäisi sisältävän jonkinlaisen id:n lopussa, joten luotan että ovat yksilöllisiä
        renderItem={({item}) => {
          console.log(item.title);//tee haku "cheese" ja katso konsolin lokista, miksi trim title:ssä on tarpeellinen..
          console.log(item.thumbnail);
          return (
            <>
              <Text>{item.title.trim()/*osa otsikoista sisältää skeidaa*/}</Text>
              <Image 
                style={{width: 50, height: 50}} 
                source={{
                  uri: item.thumbnail //arvaa kauan kesti tajuta, että tämä pitää olla uri eikä url
                }} 
              />
              <OpenURLButton url={item.href}>Show recipe</OpenURLButton> 
            </>
          )
        }}
        ItemSeparatorComponent={listSeparator}
         
      />  
      <TextInput 
        style={{backgroundColor: '#fff', fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 5 }} 
        value={incredient} 
        placeholder="Incredient"
        onChangeText={(incredient) => setIncredient(incredient)} 
      />
     <Button title="Find" onPress={getRecipes} />
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#444',
  alignItems: 'center',
  justifyContent: 'center',
 },
 results: {
  backgroundColor: '#fff',
  padding: 10,
  borderColor: '#000',
  borderWidth: 1,
  borderRadius: 5,
  marginLeft : "5%",
  marginTop: '10%',
  marginBottom: 10,
 }
});