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


export const getPackage = async (token, offset = 0, limit = 10000, orderBy = "package_name", descending, searchQuery, detailedSearch, userRole = 0) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/findAll`, {
            params: {
                offset: offset * limit,
                limit: limit,
                order_by: orderBy,
                descending: descending,
                search_query: searchQuery,
                detailed_search: detailedSearch,
                user_role: userRole
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
        selection_methode: packages.selection_methode,
        pagu: packages.pagu,
        hps: packages.hps,
        kontrak: packages.kontrak,
        ppk_name: packages.ppk_name,
        provider_name: packages.provider_name,
        planing_consultant: packages.planing_consultant,
        supervising_consultant: packages.supervising_consultant,
        contract_number: packages.contract_number,
        upload_document: packages.upload_document,
        command:packages.command
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

export const getCountPackage = async (token, searchQuery, detailedSearch, userRole = 0) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getCount`, {
            headers: {
                token: token
            },
            params: {
                search_query: searchQuery,
                detailed_search: detailedSearch,
                user_role : userRole
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

export const getCountPackageDocument = async (token, packageId, searchQuery, detailedSearch) => {
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


export const updatePackageDocumentStatus = async (token, command, packageId) => {
    const payload = {
       
        package_id: packageId,
        note: command,
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



export const getPackageStepById = async (token, stepId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStepById`, {
            params: {
                id: stepId
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


export const insertUpdatePackageStep1 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep1`, payload, {
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

export const getPackageStep1Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep1`, {
            params: {
                id: packageStepId
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


export const getPackageStep1ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep1ById`, {
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

export const updateStep1DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name
    }
    console.log(document);
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateStep1DocumentStatus`, payload, {
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


export const insertUpdatePackageStep2 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName,
        // document_type: document.document_type
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep2`, payload, {
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

export const getPackageStep2Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep2`, {
            params: {
                id: packageStepId
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


export const getPackageStep2ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep2ById`, {
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

export const updateStep2DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
        // document_type: step.document_type
    }
    console.log(document);
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateStep2DocumentStatus`, payload, {
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

export const insertUpdatePackageStep3 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep3`, payload, {
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

export const getPackageStep3Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep3`, {
            params: {
                id: packageStepId
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


export const getPackageStep3ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep3ById`, {
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

export const updateStep3DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
    }

    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateStep3DocumentStatus`, payload, {
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



export const insertUpdatePackageStep4 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep4`, payload, {
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

export const getPackageStep4Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep4`, {
            params: {
                id: packageStepId
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


export const getPackageStep4ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep4ById`, {
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

export const insertUpdatePackageStep4Command = async (token, command, pathName, packageId) => {
    const payload = {
        id: command.id,
        command_penyedia: command.command_penyedia,
        package_step_id: command.package_step_id,
        path: pathName,
        package_id: packageId
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdatePackageStep4Command`, payload, {
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


export const getPackageStep4Command = async (token, packageStepId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep4Command`, {
            params: {
                id: packageStepId
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

export const updateStep4DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep4`, payload, {
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



export const insertUpdatePackageStep5 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep5`, payload, {
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

export const getPackageStep5Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep5`, {
            params: {
                id: packageStepId
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


export const getPackageStep5ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep5ById`, {
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


export const updateStep5DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep5`, payload, {
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


export const updateStep6DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep6`, payload, {
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


export const insertUpdatePackageStep6 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName,
        provider_name: document.provider_name
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep6`, payload, {
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

export const getPackageStep6Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep6`, {
            params: {
                id: packageStepId
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


export const getPackageStep6ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep6ById`, {
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


export const insertUpdatePackageStep7 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep7`, payload, {
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

export const getPackageStep7Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep7`, {
            params: {
                id: packageStepId
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


export const getPackageStep7ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep7ById`, {
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


export const insertUpdatePackageStep8 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName,
        document_type: document.document_type
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep8`, payload, {
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

export const getPackageStep8Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep8`, {
            params: {
                id: packageStepId
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


export const getPackageStep8ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep8ById`, {
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


export const updateStep8DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
        document_type: step.document_type
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep8`, payload, {
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

export const insertUpdatePackageStep9 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep9`, payload, {
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

export const getPackageStep9Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep9`, {
            params: {
                id: packageStepId
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


export const getPackageStep9ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep9ById`, {
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



export const updateStep9DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
        document_type: step.document_type
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep9`, payload, {
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

export const insertUpdatePackageStep10 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep10`, payload, {
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

export const getPackageStep10Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep10`, {
            params: {
                id: packageStepId
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


export const getPackageStep10ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep10ById`, {
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


export const updateStep10DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep10`, payload, {
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



export const insertUpdatePackageStep11 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep11`, payload, {
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


export const updateStep11DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep11`, payload, {
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

export const getPackageStep11Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep11`, {
            params: {
                id: packageStepId
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


export const getPackageStep11ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep11ById`, {
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


export const insertUpdatePackageStep12 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        document_type: document.document_type,
        start_date: document.start_date,
        end_date: document.end_date,
        description: document.description,
        package_id: packageId,
        path: pathName,
        document_number: document.document_number
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep12`, payload, {
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


export const deleteDocumentStep12 = async (token, documentId) => {
    const payload = {
        id: documentId
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/deleteDocumentStep12`, payload, {
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

export const getPackageStep12Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep12`, {
            params: {
                id: packageStepId
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


export const getPackageStep12ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep12ById`, {
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


export const updateStep12DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
        document_type: step.document_type,
        approvals: step.approvals
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDOcumentStep12`, payload, {
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



export const insertUpdatePackageStep13 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep13`, payload, {
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

export const getPackageStep13Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep13`, {
            params: {
                id: packageStepId
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


export const getPackageStep13ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep13ById`, {
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


export const updateStep13DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep13`, payload, {
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


export const insertUpdatePackageStep14 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep14`, payload, {
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

export const getPackageStep14Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep14`, {
            params: {
                id: packageStepId
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


export const getPackageStep14ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep14ById`, {
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


export const insertUpdatePackageStep15 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep15`, payload, {
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

export const getPackageStep15Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep15`, {
            params: {
                id: packageStepId
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


export const getPackageStep15ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep15ById`, {
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


export const updateStep15DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep15`, payload, {
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



export const insertUpdatePackageStep16 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep16`, payload, {
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

export const getPackageStep16Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep16`, {
            params: {
                id: packageStepId
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


export const getPackageStep16ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep16ById`, {
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


export const insertUpdatePackageStep17 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep17`, payload, {
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

export const getPackageStep17Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep17`, {
            params: {
                id: packageStepId
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


export const getPackageStep17ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep17ById`, {
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


export const insertUpdatePackageStep18 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep18`, payload, {
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

export const getPackageStep18Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep18`, {
            params: {
                id: packageStepId
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


export const getPackageStep18ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep18ById`, {
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


export const insertUpdatePackageStep19 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep19`, payload, {
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

export const getPackageStep19Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep19`, {
            params: {
                id: packageStepId
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


export const getPackageStep19ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep19ById`, {
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


export const updateStep19DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep19`, payload, {
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



export const insertUpdatePackageStep20 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep20`, payload, {
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

export const getPackageStep20Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep20`, {
            params: {
                id: packageStepId
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


export const getPackageStep20ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep20ById`, {
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


export const insertUpdatePackageStep21 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep21`, payload, {
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

export const getPackageStep21Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep21`, {
            params: {
                id: packageStepId
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


export const getPackageStep21ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep21ById`, {
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


export const updateStep21DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep21`, payload, {
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


export const insertUpdatePackageStep22 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep22`, payload, {
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

export const getPackageStep22Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep22`, {
            params: {
                id: packageStepId
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


export const getPackageStep22ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep22ById`, {
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


export const updateStep22DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep22`, payload, {
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


export const insertUpdatePackageStep23 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName,
        document_type: document.document_type
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep23`, payload, {
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

export const getPackageStep23Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep23`, {
            params: {
                id: packageStepId
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


export const getPackageStep23ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep23ById`, {
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



export const updateStep23DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
        document_type: step.document_type
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep23`, payload, {
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


export const insertUpdatePackageStep24 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep24`, payload, {
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

export const getPackageStep24Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep24`, {
            params: {
                id: packageStepId
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


export const getPackageStep24ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep24ById`, {
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


export const updateStep24DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateStep24DocumentStatus`, payload, {
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


export const insertUpdatePackageStep25 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep25`, payload, {
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

export const getPackageStep25Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep25`, {
            params: {
                id: packageStepId
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


export const getPackageStep25ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep25ById`, {
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


export const updateStep25DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path,
        provider_name: step.provider_name,
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep25`, payload, {
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

export const insertUpdatePackageStep26 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep26`, payload, {
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

export const getPackageStep26Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep26`, {
            params: {
                id: packageStepId
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


export const getPackageStep26ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep26ById`, {
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


export const insertUpdatePackageStep27 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep27`, payload, {
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

export const getPackageStep27Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep27`, {
            params: {
                id: packageStepId
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


export const getPackageStep27ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep27ById`, {
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


export const insertUpdatePackageStep28 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep28`, payload, {
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

export const getPackageStep28Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep28`, {
            params: {
                id: packageStepId
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


export const getPackageStep28ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep28ById`, {
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


export const insertUpdatePackageStep29 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep29`, payload, {
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

export const getPackageStep29Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep29`, {
            params: {
                id: packageStepId
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


export const getPackageStep29ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep29ById`, {
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


export const updateStep29DocumentStatus = async (token, step) => {
    const payload = {
        id: step.id,
        package_step_id: step.package_step_id,
        package_id: step.package_id,
        path: step.path
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/updateDocumentStep29`, payload, {
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


export const insertUpdatePackageStep30 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep30`, payload, {
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

export const getPackageStep30Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep30`, {
            params: {
                id: packageStepId
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


export const getPackageStep30ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep30ById`, {
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


export const insertUpdatePackageStep31 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep31`, payload, {
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

export const getPackageStep31Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep31`, {
            params: {
                id: packageStepId
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


export const getPackageStep31ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep31ById`, {
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


export const insertUpdatePackageStep32 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep32`, payload, {
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

export const getPackageStep32Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep32`, {
            params: {
                id: packageStepId
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


export const getPackageStep32ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep32ById`, {
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


export const insertUpdatePackageStep33 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep33`, payload, {
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

export const getPackageStep33Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep33`, {
            params: {
                id: packageStepId
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


export const getPackageStep33ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep33ById`, {
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


export const insertUpdatePackageStep34 = async (token, document, packageId, pathName) => {
    const payload = {
        id: document.id,
        url_base64: document.url_base64,
        document_name: document.document_name,
        package_step_id: document.package_step_id,
        description: document.description,
        package_id: packageId,
        path: pathName
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/insertUpdateDocumentStep34`, payload, {
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

export const getPackageStep34Document = async (token, packageStepId) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep34`, {
            params: {
                id: packageStepId
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


export const getPackageStep34ById = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getPackageStep34ById`, {
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

export const getCountTotalPackage = async (token, userRole) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getCountTotalPackage`, {
            headers: {
                token: token
            },
            params: {
                user_role: userRole
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


export const getCountTotalPackageInProgress = async (token, userRole) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getCountTotalPackageInProgress`, {
            headers: {
                token: token
            },
            params: {
                user_role: userRole
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


export const getCountTotalPackageComplete = async (token, userRole) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/getCountTotalPackageComplete`, {
            headers: {
                token: token
            },
            params: {
                user_role: userRole
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



export const getUserAccount = async (token, offset = 0, limit = 10000, orderBy = "username", descending, searchQuery, detailedSearch) => {

    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/UserAccount/findAll`, {
            params: {
                offset: offset * limit,
                limit: limit,
                order_by: orderBy,
                descending: descending,
                search_query: searchQuery,
                detailed_search: detailedSearch
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

export const insertUpdateUserAccount = async (token, userAccount) => {
    const payload = {
        id: userAccount.id,
        username: userAccount.username,
        password: userAccount.password,
        email: userAccount.email,
        name: userAccount.name
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/UserAccount/insertUpdate`, payload, {
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

export const deleteUserAccount = async (token, userId) => {
    const payload = {
        id: userId
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/UserAccount/delete`, payload, {
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

export const getUserAccountById = async (token, userId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/UserAccount/findById`, {
            params: {
                id: userId
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

export const getCountUserAccount = async (token, searchQuery, detailedSearch) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/UserAccount/getCount`, {
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


export const updatePassword = async (token, userId, loginPassword) => {
    const payload = {
        id: userId,
        password: loginPassword
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/UserAccount/updatePassword`, payload, {
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

export const deleteDocumentStep = async (token, documentId, packageStep) => {
    const payload = {
        id: documentId,
        package_step: packageStep
    }
    try {
        let response = await axios.post(`${Config.API_ENDPOINT}/api/Package/deleteDocumentStep`, payload, {
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

export const getDetailPackage = async (token, packageId) => {
    try {
        let response = await axios.get(`${Config.API_ENDPOINT}/api/Package/findDetailPackage`, {
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