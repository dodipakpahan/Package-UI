import axios from "axios";
import { json } from "react-router-dom";
import Config from "../Config/config";
import qs from "qs";
// import Resizer from "react-image-file-resizer";

export const isTokenValid = async (token) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/UserAccount/checkToken`, {
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (true);
        } else {
            return (false);
        }
    }
    catch (exception) {
        console.log(exception);
        return (false);
    }
}


export const getPackage = async (token, offset = 0, limit = 10000, orderBy = "package_name", descending) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/findAll`, {
            params: {
                offset: offset * limit,
                limit: limit,
                order_by: orderBy,
                descending: descending,
            },
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data);
        } else {
            return ([]);
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}

export const insertUpdatePackage = async (token, packages) => {
    const payload = {
        id: packages.id,
        package_name: packages.package_name,
        start_date: packages.start_date,
        package_status: packages.package_status,
        end_date: packages.end_date,
        selection_methode: packages.selection_methode
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdate`, payload, {
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data)
        } else {
            return ([])
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}

export const deletePackage = async (token, packageId) => {
    const payload = {
        id: packageId
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/delete`, payload, {
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.error_code)
        } else {
            return ([])
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}

export const getPackageById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/findById`, {
            params: {
                id: packageId
            },
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data[0]);
        } else {
            return ([]);
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}

export const getCountPackage = async (token, searchQuery, detailedSearch) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getCount`, {
            headers: {
                token: token
            },
            params: {
                search_query: searchQuery,
                detailed_search: detailedSearch
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data);
        } else {
            return (0);
        }
    }
    catch (exception) {
        console.log(exception);
        return (0);
    }
}

export const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);

        }

        fileReader.onerror = (error) => {
            reject(error);
        }

    })
}


export const getPackageStatus = async (token) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/findAllPackageStatus`, {
            params: {
              
            },
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data);
        } else {
            return ([]);
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}


export const getPackageProcessStatus = async (token) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/findAllPackageProcessStatus`, {
            params: {
             
            },
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data);
        } else {
            return ([]);
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}


export const insertUpdatePackageDocument = async (token, document) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_id: document.package_id
    }
    console.log(document);
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdatePackageDocument`, payload, {
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data)
        } else {
            return ([])
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}

export const getPackageDocument = async (token, packageId, offset = 0, limit = 10000, orderBy = "document.created_date", descending) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageDocument`, {
            params: {
                offset: offset * limit,
                limit: limit,
                order_by: orderBy,
                descending: descending,
                id: packageId
            },
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data);
        } else {
            return ([]);
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}

export const deletePackageDocument = async (token, packageId) => {
    const payload = {
        id: packageId
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/deletePackageDocument`, payload, {
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.error_code)
        } else {
            return ([])
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}

export const getPackageDocumentById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageDocumentById`, {
            params: {
                id: packageId
            },
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data[0]);
        } else {
            return ([]);
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}

export const getCountPackageDocument = async (token,packageId, searchQuery, detailedSearch) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getCountPackageDocument`, {
            headers: {
                token: token
            },
            params: {
                id: packageId,
                search_query: searchQuery,
                detailed_search: detailedSearch
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data);
        } else {
            return (0);
        }
    }
    catch (exception) {
        console.log(exception);
        return (0);
    }
}

export const getNotification = async (token, userId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getNotification`, {
            params: {
                user_id: userId
            },
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data);
        } else {
            return ([]);
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}


export const readNotification = async (token, notificationId) => {
    const payload = {
        id: notificationId
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/readNotification`, payload, {
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.error_code)
        } else {
            return ([])
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}


export const updatePackageDocumentStatus = async (token, command) => {
    const payload = {
        id: command.id,
        package_id: command.package_id,
        note: command.note,
    }
    console.log(document);
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updatePackageDocumentStatus`, payload, {
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data)
        } else {
            return ([])
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}


export const getPackageCommand = async (token, documentId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageCommand`, {
            params: {
                id: documentId
            },
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data[0]);
        } else {
            return ([]);
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}


export const getPackageStep = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep`, {
            params: {
                id: packageId
            },
            headers: {
                token: token
            }
        });
        if (response.data.error_code === 0) {
            return (response.data.data);
        } else {
            return ([]);
        }
    }
    catch (exception) {
        console.log(exception);
        return ([]);
    }
}

