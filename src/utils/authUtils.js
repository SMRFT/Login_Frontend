import { validate } from "jsauth";
import axios from "axios";

export const decryptPermissions = (base64BitMap, permsList) => {
    if (!base64BitMap || !permsList || permsList.length === 0) return [];

    try {
        const binaryString = atob(base64BitMap);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const allowedActions = [];
        for (let i = 0; i < permsList.length; i++) {
            const byteIndex = Math.floor(i / 8);
            const bitIndex = 7 - (i % 8);
            
            if (byteIndex < bytes.length) {
                if ((bytes[byteIndex] & (1 << bitIndex)) !== 0) {
                    allowedActions.push(permsList[i]);
                }
            }
        }
        return allowedActions;
    } catch (err) {
        console.error("Manual decryption error:", err);
        return [];
    }
};

export const getValidatedUser = async (token, securityBaseUrl) => {
    const user = validate(token);
    
    // If decryption failed, try manual sync with backend
    if (typeof user.allowedActions() === 'string') {
        try {
            const permsRes = await axios.get(`${securityBaseUrl}get_permissions/`);
            const permsList = permsRes.data.permissions;
            if (permsList?.length > 0) {
                user._allowed_actions = decryptPermissions(user._allowed_actions, permsList);
            }
        } catch (err) {
            console.error("Failed to sync permissions master:", err);
        }
    }
    
    return user;
};
