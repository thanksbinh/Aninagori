import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"

export const searchAnimeName = async (debouncedValue: string) => {
  try {
    const result = await fetch(getProductionBaseUrl() + "/api/anime/search", {
      headers: {
        q: debouncedValue,
        offset: "0",
        limit: "10",
      },
    }).then((res) => res.json())
    if (!!result.error) {
      return []
    } else {
      return result.data
    }
  } catch (err) {
    console.log(err)
  }
}

export const getTotalEps = async (animeID: string) => {
  try {
    const result = await fetch(getProductionBaseUrl() + "/api/anime/total/" + animeID).then((res) => res.json())
    if (!!result.error) {
      return 0
    } else {
      return result.total
    }
  } catch (err) {
    console.log(err)
  }
}