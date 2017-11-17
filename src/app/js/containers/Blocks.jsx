import React, { Component } from 'react'
import RichTextEditor from 'react-rte'
import autobind from 'class-autobind'
import { createValueFromString } from 'react-rte'
import { EditorValue } from 'react-rte'

class TextEditor extends Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            value: createValueFromString('', 'markdown'),
            format: 'markdown',
            readOnly: false,
            currentBlock: null,

        }
    }

    render() {
        let { value, format } = this.state

        return (
            <div>
                <div>
                    <RichTextEditor
                        value={value}
                        onChange={this._onChange}
                        placeholder="Tell a story"
                        readOnly={this.state.readOnly}
                    />
                </div>

                <div>
                    <textarea
                        placeholder="Editor Source"
                        value={value.toString(format)}
                        onChange={this._onChangeSource}
                    />
                </div>
                <div>
                    <span>Save...working?:</span>
                    <button onClick={this._saveData}>Save</button>
                </div>
            </div>
        )
    }

    _saveData() {
        let { value, format } = this.state
        console.log('data: ', value.toString(format))
        this.state.currentBlock.data = value.toString(format)
        this._blocksComponent._currentBlock = this.state.currentBlock
        this._blocksComponent.updateData()
    }

    _onChange(value: EditorValue) {
        this.setState({ value })
    }

    _onChangeSource(event: Object) {
        let source = event.target.value
        let oldValue = this.state.value
        this.setState({
            value: oldValue.setContentFromString(source, this.state.format),
        })
    }

    updateData(block, blocksComponent) {
        this._blocksComponent = blocksComponent
        blocksComponent._currentBlock = block
        this.state.currentBlock = block

        let oldValue = this.state.value

        this.setState({
            value: oldValue.setContentFromString(this.state.currentBlock.data, this.state.format),
        })
    }
}

class AppComponent extends React.Component {
    state = {
        numChildren: 0,
        blocks: []
    }

    render() {
        const children = [];

        for (var i = 0; i < this.state.numChildren; i += 1) {
            children.push(<BlockChildComponent key={i} number={i} onClick={this.testFunc} data={"test"} />);
        };

        return (
            <BlockParentComponent addChild={this.onAddChild.bind}>
                {children}
            </BlockParentComponent>
        );
    }

    onAddChild = () => {
        this.setState({
            numChildren: this.state.numChildren + 1
        });
    }

    testFunc(data) {
        alert(data)
    }
}

const BlockParentComponent = props => (
    <div className="card calculator">
        <p><button onClick={props.addChild}>Add Another Child Component</button></p>
        <div id="children-pane">
            {props.children}
        </div>
    </div>
);

const BlockChildComponent = props => <button onClick={props.onClick.bind(this, props.block)}>{"Edit: " + props.block.name}</button>;

class Blocks extends Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            numChildren: 0,
            blocks: []
        }
    }
    componentDidMount() {
        this.getData()
        this.editor = <TextEditor ref={(editor) => { this.editorRef = editor }} />
    }

    getData() {
        const block1 = {
            name: 'name1',
            data: '~~data1~~ data1 data1 data1'
        }
        const block2 = {
            name: 'name2',
            data: 'data2 ``data2`` data2 data2'
        }
        this.AddChild(block1)

        this.AddChild(block2)
    }

    updateData() {
        console.log('Implement updataData()')
    }

    handleClick(block) {
        console.log('data:', block)
        this.editorRef.updateData(block, this)
    }

    AddChild(newBlock) {
        var blocks = this.state.blocks
        blocks.push(newBlock)

        this.setState({
            blocks: blocks
        })

        this.state.numChildren = this.state.numChildren + 1

    }

    testFunc(block) {
        console.log(block.name)
        console.log(block.data)
    }

    render() {
        const children = [];

        const blockD = {
            name: 'name' + (this.state.numChildren + 1),
            data: 'data' + (this.state.numChildren + 1) + ' ``data' + (this.state.numChildren + 1) + ' ~data' + (this.state.numChildren + 1) + '~',
        }
        for (var i = 0; i < this.state.blocks.length; i++) {
            children.push(<BlockChildComponent key={i} number={i} onClick={this.handleClick} block={this.state.blocks[i]} />);
        };


        return (
            <div>
                <BlockParentComponent addChild={this.AddChild.bind(this, blockD)}>
                    {children}
                </BlockParentComponent>
                <div>Blocks View</div>
                {this.editor}
            </div>

        )
    }
}


export default Blocks
