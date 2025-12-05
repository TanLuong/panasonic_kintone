declare const kintone: any;

export const findAllFieldRoutes = (
    layoutArray: { type: string; fields?: { code?: string }[] }[] | undefined
): { [key: string]: [number, number] } =>{
    const routeMap: { [key: string]: [number, number] }= {};

    if (!layoutArray) {
        return routeMap;
    }

    // 1. Iterate through each row object
    for (let rowIndex = 0; rowIndex < layoutArray.length; rowIndex++) {
        const row = layoutArray[rowIndex];

        // Only process objects of type 'ROW' that contain fields
        if (row.type === 'ROW' && Array.isArray(row.fields)) {
            
            // 2. Iterate through each field object in the row
            for (let fieldIndex = 0; fieldIndex < row.fields.length; fieldIndex++) {
                const field = row.fields[fieldIndex];

                // 3. Check for the 'code' property, which indicates a storable field
                if (field.code) {
                    // Add the field code and its route to the map
                    routeMap[field.code] = [rowIndex, fieldIndex];
                }
            }
        }
    }

    return routeMap;
}


export const getElementOfFieldCode = async (fieldCode: string, routeMap: { [key: string]: [number, number] }): Promise<HTMLElement | null> => {
    const route = routeMap[fieldCode];
    if (!route) {
        return null;
    }
    const [rowIndex, fieldIndex] = route;
    return document.querySelector(`#record-gaia > div > div:nth-child(${rowIndex + 1}) > div:nth-child(${fieldIndex + 1})`) as HTMLElement;
}
