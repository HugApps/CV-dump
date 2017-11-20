import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import FileBlock from '../components/FileBlock'
import * as actions from '../actions'

class Files extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.dispatchFetchFiles()
    }

    renderAddButton() {
        return (
            <Link to="/files/new" className="c-file-block">
                <i className="material-icons md-xxl">note_add</i>
            </Link>
        )
    }

    renderFiles() {
        return this.props.files.map(({ title, doc_id }) => {
            return (
                <FileBlock
                    key={`file-block-${title}`}
                    id={doc_id}
                    name={title}
                />
            )
        })
    }

    render() {
        return (
            <div className="u-flex-row u--wrap u-padding-lg">
                {this.renderFiles()}
                {this.renderAddButton()}
            </div>
        )
    }
}

Files.propTypes = {
    files: PropTypes.array.isRequired,
    dispatchFetchFiles: PropTypes.func.isRequired,
}

const mapStateToProps = ({ app }) => ({
    files: app.files,
})

export default connect(mapStateToProps, actions)(Files)
