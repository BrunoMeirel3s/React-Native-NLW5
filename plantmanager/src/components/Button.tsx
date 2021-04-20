import React from 'react'
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native'
import colors from '../styles/colors'

/**
 * interface é usada no typescript para forçar que 
 * ao utilizarmos o componente seja informado
 * os parametros criados aqui na interface, estamos
 * extendendo o touchable... para utilizarmos a função
 * onPress
 */
interface ButtonProps extends TouchableOpacityProps {
    title: string
}
export function Button({ title, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            {...rest}
        >
            <Text style={styles.buttonText}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        paddingHorizontal: 10
    },
    buttonText: {
        color: colors.white,
        fontSize: 24
    }
})