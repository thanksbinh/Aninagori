import { get } from "@/app/api/apiServices/httpRequest"
import { generateCodeChallenge, generateCodeVerifier } from "@/components/utils/generateCode"
import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"
import { setCookie } from "cookies-next"

const onConnectMAL = async (id: string) => {
  try {
    const codeChallenge = generateCodeChallenge(generateCodeVerifier())
    setCookie("codechallenge", codeChallenge)
    const result = await get(getProductionBaseUrl() + "/api/auth", {
      headers: {
        codeChallenge: codeChallenge,
        userID: id,
      },
    })
    window.location.href = result.url
  } catch (err) {
    console.log(err)
  }
}

export default onConnectMAL
