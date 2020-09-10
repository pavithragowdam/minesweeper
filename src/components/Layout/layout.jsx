import React, { Component } from 'react'
import { cell as Cell } from '../Cell/cell'
import './layout.scss'
import { Navbar } from 'react-bootstrap';

export class layout extends Component {

    constructor(props) {
        super(props)

        this.state = {
            boardData: this.init_boardData(this.props.height, this.props.width, this.props.mines),
            gameStatus: "Start the game",
            mineCount: this.props.mines,
        }
    }

    get_mines(data) {
        let mineArray = [];
        // eslint-disable-next-line
        data.map(datarow => {
            // eslint-disable-next-line
            datarow.map((dataitem) => {
                if (dataitem.is_mime) {
                    mineArray.push(dataitem);
                }
            });
        });
        console.log("get mimes",mineArray)
        return mineArray;
    }

    get_flags(data) {
        let mineArray = [];
        // eslint-disable-next-line
        // eslint-disable-next-line
        data.map(datarow => {
            // eslint-disable-next-line
            datarow.map((dataitem) => {
                if (dataitem.is_flag) {
                    mineArray.push(dataitem);
                }
            });
        });
        console.log("get flags",mineArray)
        return mineArray;
    }

    get_hidden(data) {
        let mineArray = [];
        // eslint-disable-next-line
        data.map(datarow => {
            // eslint-disable-next-line
            datarow.map((dataitem) => {
                if (!dataitem.is_box_revealed) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    get_randomnumber(dimension) {
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }

    init_boardData(height, width, mines) {
        let data = this.empty_list(height, width);
        console.log("create", data)
        data = this.Mimes(data, height, width, mines);
        console.log("Mimes", data)
        data = this.get_neighbours(data, height, width);
        console.log("neight", data)
        return data;
    }
    empty_list(height, width) {
        let data = [];

        for (let i = 0; i < height; i++) {
            data.push([]);
            console.log("[]",data)
            for (let j = 0; j < width; j++) {
                console.log("[i][j]",data[i][j])
                data[i][j] = {
                    x: i,
                    y: j,
                    is_mime: false,
                    neighbour: 0,
                    is_box_revealed: false,
                    isEmpty: false,
                    is_flag: false,
                };
            }
        }
        console.log("data",data)
        return data;
    }

    Mimes(data, height, width, mines) {
        let randomx, randomy, minesPlanted = 0;

        while (minesPlanted < mines) {
            randomx = this.get_randomnumber(width);
            console.log("randomx",randomx)
            randomy = this.get_randomnumber(height);
            console.log("randomy",randomy)
            console.log("checking mime",data[randomx][randomy],!(data[randomx][randomy].is_mime))
            if (!(data[randomx][randomy].is_mime)) {
                data[randomx][randomy].is_mime = true;
                minesPlanted++;  //incrementing mime by 1 bcoz it is planted in the grid
            }
        }

        return (data);
    }

    get_neighbours(data, height, width) {
        // eslint-disable-next-line
        let updatedData = data, index = 0;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].is_mime !== true) {
                    let mine = 0;
                    // eslint-disable-next-line
                    const area = this.traverse_board(data[i][j].x, data[i][j].y, data);
                    // eslint-disable-next-line
                    area.map(value => {
                        if (value.is_mime) {
                            console.log("value",value)
                            mine++;
                        }
                    });
                    console.log("mine",mine)
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mine;
                }
            }
        }

        return (updatedData);
    };


    traverse_board(x, y, data) { //adjacent cell
        console.log("x",x)
        const el = [];

        
        if (x > 0) {
            el.push(data[x - 1][y]);
            console.log("x>0",el)
        }

        
        if (x < this.props.height - 1) {
            el.push(data[x + 1][y]);
            console.log("x<h",el)
        }

        
        if (y > 0) {
            el.push(data[x][y - 1]);
        }

        
        if (y < this.props.width - 1) {
            el.push(data[x][y + 1]);
        }

        
        if (x > 0 && y > 0) {
            el.push(data[x - 1][y - 1]);
        }

        if (x > 0 && y < this.props.width - 1) {
            el.push(data[x - 1][y + 1]);
        }

        if (x < this.props.height - 1 && y < this.props.width - 1) {
            el.push(data[x + 1][y + 1]);
        }

        if (x < this.props.height - 1 && y > 0) {
            el.push(data[x + 1][y - 1]);
        }

        return el;
    }

    reveal_board() {
        // eslint-disable-next-line
        let updatedData = this.state.boardData;
        console.log("board data",this.state.boardData)
        // eslint-disable-next-line
        updatedData.map((datarow) => {
            // eslint-disable-next-line
            datarow.map((dataitem) => {
                dataitem.is_box_revealed = true;
            });
        });
        this.setState({
            boardData: updatedData
        })
    }

    
    reveal_empty(x, y, data) {
        let area = this.traverse_board(x, y, data);
        // eslint-disable-next-line
        area.map(value => {
            console.log("reveal empty",value)
            if (!value.is_flag && !value.is_box_revealed && (value.isEmpty || !value.is_mime)) {
                data[value.x][value.y].is_box_revealed = true;
                if (value.isEmpty) {
                    this.reveal_empty(value.x, value.y, data);
                }
            }
        });
        return data;

    }


    handle_unit_lick(x, y) {

        if (this.state.boardData[x][y].is_box_revealed || this.state.boardData[x][y].is_flag) return null;

        if (this.state.boardData[x][y].is_mime) {  //is mime is true and we click on it then alert game will over and need to reveal the board
            this.setState({ gameStatus: "Lost the game" });
            this.reveal_board();
            alert("game over");
        }

        let updatedData = this.state.boardData;
        updatedData[x][y].is_flag = false;
        updatedData[x][y].is_box_revealed = true;

        if (updatedData[x][y].isEmpty) {
            updatedData = this.reveal_empty(x, y, updatedData);
        }

        if (this.get_hidden(updatedData).length === this.props.mines) {
            this.setState({ mineCount: 0, gameStatus: "Won the game" });
            this.reveal_board();
            alert("Won the game");
        }

        this.setState({
            boardData: updatedData,
            mineCount: this.props.mines - this.get_flags(updatedData).length,
        });
    }


    handle_content(e, x, y) {
        e.preventDefault();
        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;

        if (updatedData[x][y].is_box_revealed) return;

        if (updatedData[x][y].is_flag) {
            updatedData[x][y].is_flag = false;
            mines++;
        } else {
            updatedData[x][y].is_flag = true;
            mines--;
        }

        if (mines === 0) {
            const mineArray = this.get_mines(updatedData);
            const FlagArray = this.getFlags(updatedData);
            if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
                this.setState({ mineCount: 0, gameStatus: "You Win." });
                this.reveal_board();
                alert("You Win");
            }
        }

        this.setState({
            boardData: updatedData,
            mineCount: mines,
        });
    }

    renderBoard(data) {
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => this.handle_unit_lick(dataitem.x, dataitem.y)}
                            cMenu={(e) => this.handle_content(e, dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>);
            })
        });

    }


    render() {
        return (
            <div className="board">
                <div className="game-info">
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand>{this.state.mineCount}mimes</Navbar.Brand>
                        <Navbar.Brand style={{ margin: "0 45px" }}>{this.state.gameStatus}</Navbar.Brand>
                    </Navbar>
                </div>
                {this.renderBoard(this.state.boardData)}
            </div>
        )
    }
}


export default layout
