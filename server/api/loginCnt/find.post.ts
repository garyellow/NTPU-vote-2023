import { id } from 'element-plus/es/locales.mjs'
import prisma from '~/lib/prisma'
export default defineEventHandler(async (event) => {
    // 確認權限
    if (!event.context.session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: '未登入',
        })
    }

    if (!event.context.isAdmin) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: '不是管理員',
        })
    }

    // 執行操作
    const { loginId } = await readBody(event) as {
        loginId: string,
    }

    if (!loginId || isNaN(parseInt(loginId))) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Parameter "loginId" is required and must be a number.',
        })
    }
    
    console.log('id', id)
    const item = await prisma.voterLogin.findUnique({
        where: { id: parseInt(loginId) },
        select: {
            voterId: true,
            time: true,
        },
    })
    if (!item) {
        console.error('找不到登入紀錄', loginId)
        return null; // or handle the null case accordingly
    }
    console.log('id', item.voterId)
    console.log('time', item.time)

    return {
        loginId: loginId,
        id: item.voterId,
        time: item.time,
    }
})
