import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [idade, setIdade] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [listData, setListData] = useState([]);

  useEffect(() => {
    getDadosCadastrados();
  }, []);

  const handleCadastro = async () => {
    if (nome.trim() === '' || cpf.trim() === '' || idade.trim() === '' || cep.trim() === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;
      const enderecoCompleto = `${logradouro}, ${bairro}, ${localidade} - ${uf}`;
      setEndereco(enderecoCompleto);

      await axios.post('http://172.16.7.19:3000/cadastros', {
        nome,
        cpf,
        idade,
        cep,
        endereco: enderecoCompleto
      });

      setListData(prevListData => [
        ...prevListData,
        { id: Math.random().toString(), nome, cpf, idade, cep, endereco: enderecoCompleto }
      ]);

      setNome('');
      setCpf('');
      setIdade('');
      setCep('');
      setEndereco('');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Erro ao cadastrar usuário. Por favor, tente novamente.');
    }
  };

  const getDadosCadastrados = async () => {
    try {
      const response = await axios.get('http://172.16.7.19:3000/cadastros');
      setListData(response.data);
    } catch (error) {
      console.error('Erro ao obter dados cadastrados:', error);
      alert('Erro ao obter dados cadastrados. Por favor, tente novamente.');
    }
  };

  async function handleBlurCep() {
    if (cep.trim().length !== 8) {
      alert('Por favor, insira um CEP válido.');
      return;
    }
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;
      const enderecoCompleto = `${logradouro}, ${bairro}, ${localidade} - ${uf}`;
      setEndereco(enderecoCompleto);
    } catch (error) {
      console.error('Erro ao obter o endereço:', error);
      alert('Erro ao obter o endereço. Por favor, verifique o CEP e tente novamente.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        textAlign="center"
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        textAlign="center"
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        textAlign="center"
      />
      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={cep}
        onChangeText={setCep}
        keyboardType="numeric"
        onBlur={handleBlurCep}
        textAlign="center"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço completo"
        value={endereco}
        onChangeText={setEndereco}
        editable={false}
        textAlign="center"
      />
      <Button
        title="Cadastrar"
        onPress={handleCadastro}
        color="#800080" // roxo
        style={styles.button}
      />
      <FlatList
        style={styles.list}
        data={listData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>Nome: {item.nome}</Text>
            <Text>CPF: {item.cpf}</Text>
            <Text>Idade: {item.idade}</Text>
            <Text>CEP: {item.cep}</Text>
            <Text>Endereço: {item.endereco}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // branco
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#800080', // roxo
  },
  input: {
    borderWidth: 1,
    borderColor: '#800080', // roxo
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    color: '#000000', // preto
  },
  list: {
    width: '100%',
  },
  listItem: {
    padding: 10,
    backgroundColor: '#C0C0C0',
    marginBottom: 10,
    borderRadius: 5,
  },
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: '#800080', // roxo
            },
            headerTintColor: '#FFFFFF', // branco
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
