import React, { useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'

const ListComponent = ({ data, listName }) => {
    console.log(data)
    const alertClick = (e, item) => {
        e.preventDefault()
        console.log(item)
    }
    return (
        <>
        <div style={{paddingLeft: "3em", paddingRight: "3em", paddingTop: "1em", paddingBottom: "2em", border: "1px solid #c4c4c4", borderRadius: "20px"}}>
            <div>
                <h3>{listName}</h3>
                <hr></hr>
            </div>
            <ListGroup>
                {data.map((item, i) => { console.log(item);
                    return <ListGroup.Item key={i} action onClick={(event) =>alertClick(event, item)}>{item.name}</ListGroup.Item>
                })}
            </ListGroup>
            </div>
        </>
    )
}

export default ListComponent