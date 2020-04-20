import React from 'react';
import OnitamaCard from './OnitamaCard.js';

class OnitamaCardBar extends React.Component {
  constructor(props){
    super(props);

    this.selectCardClick = this.selectCardClick.bind(this);
  }

  selectCardClick(cardTypeId, cardStatus){
    this.props.selectCardClick(cardTypeId, cardStatus);
  }

  render() {

    return (
      <div>
        <div className="row">
          <OnitamaCard
            cardTypeId={this.props.cards[3].cardTypeId}
            isSelected={this.props.cards[3].isSelected}
            selectCardClick={this.selectCardClick}
            cardStatus={3}
            tabletopMode={this.props.tabletopMode}
            playerOneTurn={this.props.playerOneTurn}
          />
          <OnitamaCard
            cardTypeId={this.props.cards[4].cardTypeId}
            isSelected={this.props.cards[4].isSelected}
            selectCardClick={this.selectCardClick}
            cardStatus={3}
            tabletopMode={this.props.tabletopMode}
            playerOneTurn={this.props.playerOneTurn}
          />
        </div>
        <div className="row" style={{marginTop: "3px"}}>
          <OnitamaCard
            cardTypeId={this.props.cards[2].cardTypeId}
            isSelected={this.props.cards[2].isSelected}
            selectCardClick={this.selectCardClick}
            cardStatus={2}
            tabletopMode={this.props.tabletopMode}
            playerOneTurn={this.props.playerOneTurn}
          />
        </div>
        <div className="row" style={{marginTop: "3px"}}>
          <OnitamaCard
            cardTypeId={this.props.cards[0].cardTypeId}
            isSelected={this.props.cards[0].isSelected}
            selectCardClick={this.selectCardClick}
            cardStatus={1}
            tabletopMode={this.props.tabletopMode}
            playerOneTurn={this.props.playerOneTurn}
          />
          <OnitamaCard
            cardTypeId={this.props.cards[1].cardTypeId}
            isSelected={this.props.cards[1].isSelected}
            selectCardClick={this.selectCardClick}
            cardStatus={1}
            tabletopMode={this.props.tabletopMode}
            playerOneTurn={this.props.playerOneTurn}
          />
        </div>
      </div>
    );
  }
}

export default OnitamaCardBar;
