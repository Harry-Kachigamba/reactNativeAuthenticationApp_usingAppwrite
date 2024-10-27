import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Client, Account, ID, Models } from 'react-native-appwrite';
import React, { useState } from "react";

{/* Setting varible types */}
let client: Client;
let account: Account;

client = new Client();

{/* Innitializing Appwrite details */}
client
    .setEndpoint('xxxxxxxxxx')
    .setProject('xxxxxxxxxx')
    .setPlatform('xxxxxxxxxx');

account = new Account(client);

export default function Home() {
    const [loggedInUser, setLoggedInUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    async function login(email: string, password: string) {
        await account.createEmailPasswordSession(email, password);
        setLoggedInUser(await account.get());
    }

    async function register(email: string, password: string, name: string) {
        await account.create(ID.unique(), email, password, name);
        await login(email, password);
        setLoggedInUser(await account.get());
    }

    return (
        <View style={styles.container}>
            <Text>
                {loggedInUser ? `Logged in as ${loggedInUser.name}` : 'Not logged in'}
            </Text>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => login(email, password)}
                >
                    <Text>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={()=> register(email, password, name)}
                >
                    <Text>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        await account.deleteSession('current');
                        setLoggedInUser(null);
                    }}
                >
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>

            <StatusBar style='dark' />
        </View>

    );
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 50,
            backgroundColor: '#fff'
        },

        input: {
            width: 300,
            height: 50,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 15,
            marginBottom: 10,
            fontSize: 16
        },

        button: {
            height: 50,
            backgroundColor: '#476f95',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginBottom: 20
        },
});

