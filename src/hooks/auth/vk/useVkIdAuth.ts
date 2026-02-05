'use client'

import * as VKID from "@vkid/sdk";
import { getVkAuthCreds } from "@/lib/auth/authConfig";

const initVKID = async () => {
  const { appId, redirectUrl } = await getVkAuthCreds();

  VKID.Config.init({
    app: appId,
    redirectUrl,
    responseMode: VKID.ConfigResponseMode.Callback,
    source: VKID.ConfigSource.LOWCODE,
    scope: "phone email",
  });
};

export const useVkIdAuth = async () => {
  await initVKID();

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