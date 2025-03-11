import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';

const BasicForm = ({ validation }) => {
  return (
    <Formik
      initialValues={{ name: '', apellido: '', numero: '' }}
      validate={validation} // Usamos la función de validación pasada como prop
      onSubmit={(values) => {
        console.log('Formulario enviado:', values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Formulario Básico</Text>

          {/* Campo para el nombre */}
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
          />
          {touched.name && errors.name && (
            <Text style={styles.error}>{errors.name}</Text>
          )}

          {/* Campo para el apellido */}
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            onChangeText={handleChange('apellido')}
            onBlur={handleBlur('apellido')}
            value={values.apellido}
          />
          {touched.apellido && errors.apellido && (
            <Text style={styles.error}>{errors.apellido}</Text>
          )}

          {/* Campo para el número */}
          <TextInput
            style={styles.input}
            placeholder="Número"
            onChangeText={handleChange('numero')}
            onBlur={handleBlur('numero')}
            value={values.numero}
            keyboardType="numeric"
          />
          {touched.numero && errors.numero && (
            <Text style={styles.error}>{errors.numero}</Text>
          )}

          {/* Botón de envío */}
          <Button onPress={handleSubmit} title="Enviar" />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'pink',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default BasicForm;