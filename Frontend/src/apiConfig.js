// central place for API base URL configuration
// can be overridden using environment variable REACT_APP_API_BASE_URL

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export default API_BASE_URL;
