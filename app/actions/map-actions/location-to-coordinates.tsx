"use server" 

export default async function LocationToCoordinates(location: string, eloc: string) {
  try {
    const res = await fetch(
      `https://apis.mappls.com/advancedmaps/v1/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/geocode?address=${location}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
      console.log(res);
    return res.json();
  } catch (error) {
      console.log("error of api call", error);
  }
}

