export interface MessageType{
    sender: 'You' | 'Bot';
    text: string;
    image?: string;
}