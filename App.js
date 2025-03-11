import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Funciones de manejo de sesión
const saveSession = async (user) => {
  try {
    await AsyncStorage.setItem('userSession', JSON.stringify(user));
    console.log('Sesión guardada correctamente');
  } catch (error) {
    console.error('Error al guardar la sesión:', error);
  }
};

const getSession = async () => {
  try {
    const user = await AsyncStorage.getItem('userSession');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    return null;
  }
};

const removeSession = async () => {
  try {
    await AsyncStorage.removeItem('userSession');
    console.log('Sesión eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar la sesión:', error);
  }
};

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre obligatorio').min(3, 'Nombre muy corto'),
  apellido: Yup.string().required('Apellido obligatorio').min(3, 'Apellido muy corto'),
  numero: Yup.string().required('Número obligatorio').min(8, 'Número muy corto'),
  password: Yup.string().required('Contraseña obligatoria').min(6, 'Mínimo 6 caracteres'),
});

// Pantalla de Registro
const RegisterScreen = ({ navigation }) => (
  <Formik
    initialValues={{ name: '', apellido: '', numero: '', password: '' }}
    validationSchema={validationSchema}
    onSubmit={async (values, { resetForm }) => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(values));
        Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
        resetForm();
        navigation.navigate('Login');
      } catch (error) {
        console.error('Error al registrar:', error);
      }
    }}
  >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>
        {['name', 'apellido', 'numero', 'password'].map((field, index) => (
          <View key={index}>
            <TextInput
              style={styles.input}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              secureTextEntry={field === 'password'}
              keyboardType={field === 'numero' ? 'numeric' : 'default'}
              onChangeText={handleChange(field)}
              onBlur={handleBlur(field)}
              value={values[field]}
            />
            {touched[field] && errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
          </View>
        ))}
        <Button onPress={handleSubmit} title="Registrarse" />
        <Button title="Ir a Login" onPress={() => navigation.navigate('Login')} />
      </View>
    )}
  </Formik>
);

// Pantalla de Inicio de Sesión
const LoginScreen = ({ navigation }) => (
  <Formik
    initialValues={{ numero: '', password: '' }}
    onSubmit={async (values) => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) {
          Alert.alert('Error', 'No hay usuarios registrados');
          return;
        }
        const user = JSON.parse(userData);
        if (user.numero === values.numero && user.password === values.password) {
          await saveSession(user);
          navigation.navigate('Home');
        } else {
          Alert.alert('Error', 'Número o contraseña incorrectos');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    }}
  >
    {({ handleChange, handleBlur, handleSubmit, values }) => (
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          style={styles.input}
          placeholder="Número"
          keyboardType="numeric"
          onChangeText={handleChange('numero')}
          onBlur={handleBlur('numero')}
          value={values.numero}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          value={values.password}
        />
        <Button onPress={handleSubmit} title="Ingresar" />
        <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
      </View>
    )}
  </Formik>
);

// Pantalla de Inicio (Home)
const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionUser = await getSession();
      setUser(sessionUser);
    };
    fetchSession();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      {user && <Text>{user.name} {user.apellido} ({user.numero})</Text>}
      <Button title="Cerrar sesión" onPress={async () => {
        await removeSession();
        navigation.navigate('Login');
      }} />
    </View>
  );
};

// Configuración de Navegación
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fef6f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#f78fb3',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#f78fb3',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});