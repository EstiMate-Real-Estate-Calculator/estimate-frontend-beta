import TokenHandler from "@lib/auth/tokenHandler";
import AuthHandler from "@lib/auth/authHandler";

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const {userid} = await AuthHandler.logIn({ username, password });

        // Ensure userId is a number
        const numericUserId = Number(userid);
        
        if (isNaN(numericUserId)) {
            throw new Error('Invalid userId returned from login');
        }

        const token = await TokenHandler.getToken(numericUserId);

        return new Response(JSON.stringify({ token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}