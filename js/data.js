const API_KEY = "$2a$10$ORMl4/k6nH.Yqy7avMNAZeA0ywZe9owYLpZiKjBesQUcg8g30V0vS";  // jsonbin API master key

export const fetchBooksData = async (URLd) => {
    try {
        // jsonbin CORS ees uuden API key ashiglasan
        const response = await fetch(URLd, {
            method: "GET",
            headers: {
                "X-Master-Key": API_KEY,
                "Accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Books data олдсонгүй: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data);  

        if (!data || !data.record) {
            throw new Error("Invalid API response");
        }

        return data.record; 

    } catch (error) {
        console.error("Error fetch:", error);
        return [];  
    }
};

  
  


