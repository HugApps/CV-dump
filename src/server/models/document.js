const { sqlInsert, sqlSelect, sqlUpdate } = require('../db')
const _ = require('lodash')

const CREATE_DOC_SQL = 'INSERT INTO documents (uuid, created_at, title, user_id, version) VALUES (?, NOW(), ?, ?, ?)'
const FIND_RECENT_BY_USERID = 'SELECT uuid, title, created_at FROM documents where user_id = ?'
//const FIND_RECENT_BY_USERID_DOCID = 'SELECT uuid, user_id, title, created_at, comments, blocks FROM documents where user_id = ? AND uuid = ? AND version = 1'
//const FIND_FILEPATH = 'SELECT filepath, filename from documents where uuid = ?'
const FIND_FILEPATH_BY_DOCID = 'SELECT filepath, filename from documents where uuid = ?'

const UPDATE_FILEPATH = 'UPDATE documents SET filepath = ?, filename = ? WHERE uuid = ?'
const UPDATE_TITLE_BY_DOC_ID = 'UPDATE documents set title = ? WHERE uuid = ?'
const FIND_SHARED_BY_USEREMAIL = 'SELECT d.uuid, s.owner_id, s.user_email, d.title, d.created_at FROM shared_files s JOIN documents d ON s.document_id = d.uuid WHERE s.user_email = ? OR s.owner_id = ?'
const CHECK_USER_PERMISSION_ON_DOC = 'SELECT user_email from documents join shared_files where uuid = ?'

const SELECT_UUID = 'SELECT UUID() as uuid'
/*This will be visible to public*/
const ParseDocSQL = (rows) => {
    return _.map(rows, function (entries) {
        return {
            title: entries.title,
            docId: entries.uuid,
            filename: entries.filename,
            filepath: entries.filepath,
            userId: entries.owner_id,
        }
    })
}

class Document {
    constructor(props) {
        if (props) {
            this.doc_id = props.uuid
            this.title = props.title ? props.title : 'untitled'
            this.user_id = props.user_id
            this.version = props.version
            this.filepath = props.filepath ? props.filepath : ''
            this.filename = props.filename ? props.filename : ''
        }
    }

    SQLValueArray() {
        return [ this.uuid, this.title, this.user_id, this.version ]
    }

    save() {
        return new Promise((resolve, reject) => {

            sqlInsert(CREATE_DOC_SQL, this.SQLValueArray(), (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result) {
                    return reject(new Error('Unknown Error'))
                }

                return resolve(this)
            })
        })
    }

    static create(props) {

        return new Promise((resolve, reject) => {
            const doc   = new Document()
            doc.uuid    = props.uuid
            doc.title   = props.title
            doc.version = props.version
            doc.user_id = props.user_id
            doc.save().then((savedDoc) => {
                resolve(savedDoc)
            }).catch((error) => {
                console.error(`[Doc][Error] Failed to create Document: ${error.message}`)
                reject(new Error('Internal Server Error'))
            })
        })
    }


    /*Needed inorder to get uuid for document blocks insertion at file create time*/
    static GetNewUuid(){
        return new Promise((resolve, reject) => {
            sqlSelect(SELECT_UUID, [] , (err, res) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                resolve(res[0])
            })
        })
    }

    static LoadDocumentsByUserId(user_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_RECENT_BY_USERID, [ user_id ], (err, documents) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                let userFiles = { 'files': ParseDocSQL(documents) }
                resolve(userFiles)
            })
        })
    }


    static LoadSharedDocumentsByUserEmail(user_email, user_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_SHARED_BY_USEREMAIL, [ user_email, user_id ], (err, documents) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                let userFiles = { 'files': ParseDocSQL(documents) }
                resolve(userFiles)
            })
        })
    }


    static UpdateTitleByDocid(doc_id, title) {

        return new Promise((resolve, reject) => {
            sqlUpdate(UPDATE_TITLE_BY_DOC_ID, [ title, doc_id ], (err, res) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                resolve(res)
            })
        })
    }

    static FindFilepathByDocid(doc_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_FILEPATH_BY_DOCID, [doc_id], (err, documents) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                resolve(documents)
            })
        })
    }

    /*Should only be called when first creating pdf*/
    static UpdateDocumentFilepath(doc_id, filepath, filename) {
        return new Promise((resolve, reject) => {
            sqlUpdate(UPDATE_FILEPATH, [ filepath, filename, doc_id ], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                resolve(result)
            })
        })
    }

    //validate user permitted to save
    static VaildateDocumentPermission(doc_id, user_email) {
        return new Promise((resolve, reject) => {
            sqlSelect(CHECK_USER_PERMISSION_ON_DOC, [doc_id], (err, result) => {
                if(err){
                    console.error(err)
                    return reject(err)
                }
                if( result.length <= 0 || result.find(email => email === user_email ) === -1  ){
                    resolve(false)
                }
                else{
                    resolve(true)
                }
            })
        })
    }


    static shareFile(ownerId, doc_id, emails) {
        const shareQuery = ' INSERT INTO shared_files ( owner_id, user_email, document_id) VALUES ( ?, ?, ?)'
        let queries = []
        emails.forEach((email) => {
            queries.push(
                new Promise((resolve, reject) => {
                    sqlInsert(shareQuery, [ownerId, email, doc_id], (err, result) => {
                        if (err) {
                            return reject(new Error('Database Error'))
                        }
                        if (!result/** || result**/) { // Check valid result ... ?
                            return reject(new Error('Unknown Error'))
                        }
                        return resolve({ docId: doc_id, sent_email: email })
                    })

                })
            )
        })
        return Promise.all(queries)
    }
}


module.exports = { Document }
