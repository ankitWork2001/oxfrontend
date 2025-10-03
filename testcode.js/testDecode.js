const jwtDecode = require('jwt-decode');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzU1NTgyNmU4NjVjNDgzMzM5Y2E2NCIsImlhdCI6MTc0ODM1MTgzNn0.uov-MSZtKZI91q0UsVrvhPA-fXhyDzIgssDIEdGwpRE'; // Put a real JWT string here
const decoded = jwtDecode(token);
console.log(decoded);
