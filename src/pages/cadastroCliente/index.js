import React, { useState } from "react";
import { Button } from "react-native";
import { View, StyleSheet, TextInput } from "react-native";
import usuarioService from "../../service/signIn/serviceUsuario";
import { useNavigation } from "@react-navigation/native";

import CameraComponent from "./cameraComponent";
import { binary } from "./cameraComponent";
import { TextInputMask } from "react-native-masked-text";
import { CheckBox } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";

export default function CadastroCliente({ navigation, route }){

    const [codigo, setCodigo] = useState(null);

    const [nome, setNome] = useState(null);
    const [documento, setDocumento] = useState(null);
    const [cep, setCep] = useState(null);
    const [telefone, setTelefone] = useState(null);
    const [foto, setFoto] = useState(null);
    const setaImg = (item) =>{
        setFoto(item);
    }

    const [isCnpj, setIsCnpj] = useState(false);
    const [typeMask, setTypeMask] = useState('cpf');
    
    const setarMaskDoc = () =>{
        setIsCnpj(!isCnpj);
        setDocumento("");
        if(isCnpj){
            setTypeMask("cpf");               
        }else{
            setTypeMask("cnpj");    
        }
        
    };

    const pegar = async () => {        
        if(route.params.idCliente != 0 && codigo == null){
            const todoClientes = await usuarioService.getClienteID(route.params.idCliente);

            setCodigo(String(route.params.idCliente));
            setNome(todoClientes.nome_cli);
            setTelefone(todoClientes.telefo_cli);
            setDocumento(todoClientes.docume_cli);
            setCep(todoClientes.codend_cli.cep_end);
            setFoto(todoClientes.foto_cli);
        }
    }

    pegar();

    const cadastra = async () => {
        let data;

        if(codigo){
            data = {
                codigo_cli: codigo,
                nome_cli: nome,
                docume_cli: documento,
                cep_end: cep,
                telefo_cli: telefone,
                foto_cli: foto
            }
        }else{
            data = {
                nome_cli: nome,
                docume_cli: documento,
                cep_end: cep,
                telefo_cli: telefone,
                foto_cli: foto
            }
        }

        const status = await usuarioService.criarCliente(data);
        route.params.onClienteCadastrado( await usuarioService.getCliente());
        navigation.goBack();        
    }

    const deleta = async () => {
        const status = await usuarioService.deletar(codigo);
        route.params.onClienteCadastrado( await usuarioService.getCliente());
        navigation.goBack();        
    }

    function exibirDeleta (){
        if(codigo){
            return(
                <View>
                    <TouchableOpacity 
                    style={styles.botaoDeletar}
                    onPress={() => deleta()}
                    >
                        <Text style={styles.textoDeleta} >DELETAR</Text>
                    </TouchableOpacity>
                    
                </View>                
            )
        }
    }

    return(
        <View style={styles.container} >
            
            <CameraComponent setFotoCarrega={setaImg} fotoCarrega={foto}/>

            <View style={styles.containerTexto}>

                <View style={{flexDirection: "row"}}>
                    <Text style={styles.label}>Nome:</Text>
                    <TextInput
                        style={styles.usuario}
                        editable
                        numberOfLines={1}
                        maxLength={250}
                        placeholder="Nome"
                        id="nome"
                        onChangeText={value => setNome(value)}
                        value={nome}
                    />
                </View>

                <View style={{flexDirection: "row"}}>
                    <Text style={styles.label}>Documento:</Text>
                    <TextInputMask
                        style={styles.inputCheckCima}
                        editable                    
                        numberOfLines={1}                    
                        type={typeMask}
                        keyboardType='number-pad'
                        placeholder="Documento"
                        id="documento"
                        onChangeText={value => setDocumento(value)}
                        value={documento}
                    />
                </View>
                <CheckBox title={"É cnpj ?"} containerStyle ={{backgroundColor: 'transparent', borderWidth: 0}} checked={isCnpj} onPress={setarMaskDoc}/>
                <View style={{flexDirection: "row"}}>
                    <Text style={styles.label}>Cep:</Text>
                    <TextInput
                        style={styles.inputCheckBaixo}
                        editable                    
                        numberOfLines={1}
                        maxLength={14}
                        keyboardType='number-pad'
                        placeholder="Cep"
                        id="cep"
                        onChangeText={value => setCep(value)}
                        value={cep}
                    />
                </View>
                <View style={{flexDirection: "row"}}>
                    <Text style={styles.label}>Telefone:</Text>
                    <TextInput
                        style={styles.senha}
                        editable
                        multiline
                        numberOfLines={1}
                        maxLength={14}
                        keyboardType='phone-pad'
                        placeholder="Telefone"
                        id="Telefone"
                        onChangeText={value => setTelefone(value)}
                        value={telefone}
                    />
                </View>
                <Button 
                    title="Cadastrar"
                    style={styles.botao}
                    onPress={() => cadastra()}
                />

                {exibirDeleta()}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    usuario: {
        fontSize: 20,
        padding: 2,
        width: 230,
        borderBottomWidth: 1
    },
    label:{
        fontSize: 20,
        marginEnd: 10,
        marginTop: 3
    },
    senha: {
        fontSize: 20,        
        padding: 2,  
        width: 208,
        marginBottom: 10,      
        borderBottomWidth: 1
    },
    inputCheckCima: {
        fontSize: 20,  
        width: 180,      
        padding: 2,        
        borderBottomWidth: 1
    },    
    inputCheckBaixo: {
        fontSize: 20,   
        width: 250,             
        padding: 2,        
        borderBottomWidth: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      },
    containerTexto: {
        marginTop: 50,
        width: 300
    },
    foto:{
        width: 50,
        height: 50,
        marginTop: 50 ,
        resizeMode: "stretch",
        margin: "auto",
        borderRadius: 500,
        marginLeft: 50
    },    
    botaoDeletar:{
        marginTop: 2,
        backgroundColor: 'rgb(150,0,0)',
        borderRadius: 2,
        height: 35,
        verticalAlign: "middle"
    },
    botaoOrcamento:{
        marginTop: 2,
        backgroundColor: 'rgb(0,100,0)',
        borderRadius: 2,
        height: 35,
        verticalAlign: "middle"
    },
    textoDeleta:{
        fontSize: 14,
        textAlign: "center",
        color: 'rgb(255,255,255)',
        marginTop: 6
    }
})