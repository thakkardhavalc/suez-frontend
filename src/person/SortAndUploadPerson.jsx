import { useState } from "react";

export default function SortAndUploadPerson() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sortAndUpload = async () => {
        try {
            setLoading(true);
            setError(null);

            // Retrieve CSV file from the REST endpoint
            const response = await fetch('https://birt.eriscloud.com/interviewer/data', {
                method: 'GET',
                headers: {
                    'x-access-token': 'e392hb'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to retrieve CSV file');
            }
            
            const csvText = await response.text();

            // Parse CSV data into array of objects
            const lines = csvText.split('\n');
            const headers = lines[0].split(',');
            const people = lines.slice(1).map(line => {
                const values = line.split(',');
                const person = {};
                headers.forEach((header, index) => {
                    person[header.trim()] = values[index].trim();
                });
                return person;
            });

            // Sort the list alphabetically by first name
            people.sort((a, b) => {
                return a['First Name'].localeCompare(b['First Name']);
            });

            // Upload the sorted list as JSON
            const sortedJson = JSON.stringify(people);
            const uploadResponse = await fetch('https://birt.eriscloud.com/interviewer/data', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': 'e392hb'
                },
                body: sortedJson
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload sorted list');
            }

            alert('Sorted list uploaded successfully');
        } catch (error) {
            console.error(error);
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Sort and Upload People</h1>
            <button onClick={sortAndUpload} disabled={loading}>
                {loading ? 'Loading...' : 'Sort and Upload'}
            </button>
            {error && <p>{error}</p>}
        </div>
    );
}