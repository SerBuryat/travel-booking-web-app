'use client'

import * as VKID from "@vkid/sdk";

const VK_APP_ID = process.env.NEXT_PUBLIC_VK_APP_ID;
const REDIRECT_URL = process.env.NEXT_PUBLIC_VK_ID_REDIRECT_URL;

const initVKID = () => {
  VKID.Config.init({
    app: Number(VK_APP_ID),
    redirectUrl: REDIRECT_URL,
    responseMode: VKID.ConfigResponseMode.Callback,
    source: VKID.ConfigSource.LOWCODE,
    scope: "phone email",
  });
};

export const useVkIdAuth = async () => {
  initVKID();

  const data = await VKID.Auth.login();
  const anyData = data as unknown as {
    type?: string;
    code?: string;
    device_id?: string;
    deviceId?: string;
  };
  const code = anyData.code;
  const deviceId = anyData.device_id ?? anyData.deviceId;

  if (anyData.type !== "code_v2" || !code || !deviceId) {
    throw new Error("VK login response без code_v2 / code / deviceId");
  }

  const tokens = await VKID.Auth.exchangeCode(code, deviceId);
  const accessToken = (tokens as { access_token?: string }).access_token;

  if (!accessToken) {
    throw new Error("VK tokens без access_token");
  }

  return await VKID.Auth.userInfo(accessToken);
};