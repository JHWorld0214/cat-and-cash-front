import { useFetch } from '@/hooks/useFetch';

export async function isNewUser(token: string): Promise<boolean> {
    const { post } = useFetch();

    try {
        console.log('서버에 유저 상태 확인 요청');
        const res = await post<{ isNew: number }>('/login/new', {});

        console.log('응답:', res);

        const userType = res.isNew;

        if (typeof userType !== 'number') {
            throw new Error('userType 누락됨');
        }

        return userType === 0;
    } catch (err) {
        console.error('❌ isNewUser 실패:', err);
        throw err;
    }
}