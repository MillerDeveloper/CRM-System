import { connection } from 'mongoose'

export async function checkExistWorkspace(workspaceName: string) {
    if (connection.db) {
        const result = await getListDatabases()
        return !!result.databases?.find(
            (database: { name: string }) =>
                database.name?.toLowerCase().trim() === workspaceName?.toLowerCase()?.trim()
        )
    } else {
        throw new Error('Connection is denied')
    }
}

export function getListDatabases() {
    return connection.db?.admin()?.listDatabases()
}
