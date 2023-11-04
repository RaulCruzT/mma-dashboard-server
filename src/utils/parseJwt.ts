import jwtDecode from 'jwt-decode';
import { UserPayloadInterface } from '../data/interfaces/google';

export default function parseJwt(token: string): UserPayloadInterface {
    return jwtDecode(token) as UserPayloadInterface;
}