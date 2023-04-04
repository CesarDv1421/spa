import bcrypt from 'bcryptjs';

const encrypt = {};

encrypt.encryptPassword = async (password) => {

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash
}

encrypt.matchPassword = async (password, encryptedPassword) => {

    try {
        //Compara la contrasena escrita por el usuario con la contrasena en la base de datos (encriptada)
        return await bcrypt.compare(password, encryptedPassword)
    }
    catch (e) {
        console.log(e)
    }

}

export default encrypt