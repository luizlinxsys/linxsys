import React, { useState  } from "react";

import {
  makeStyles,
  Paper
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  mainWrapper: {
		width: '100%',
		minHeight: '200px',
		overflowY: "scroll",
  },
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  embedContainer: {
    width: "100%",
    display: "flex"
  },
  embedIframe: {
    aspectRatio: 16 / 9,
    width: "70%",
    height: "100%"
  }

}));

const Helps = () => {
  const classes = useStyles();

  const [records] = useState([
    {
    id: 1,
    title: 'Criando a conexão',
    description: 'Primeiros passos para começar o atendimento',
    video: 'A9iKegEVz4s'
  },
    {
    id: 2,
    title: 'Primeiro atendimento',
    description: 'Veja como é fácil realizar seu primeiro atendimento com a Naty',
    video: 'bajfI3YXrtU'
  },
    {
    id: 3,
    title: 'Filas de atendimento',
    description: 'Como criar filas para separar e organizar seus atendimentos',
    video: 'pgyqaQhe1TQ'
  },
]);



  const renderVideo = (record) => {
    const url = `https://www.youtube.com/embed/${record.video}`;
    return (
      <iframe style={{ width: 700, height: 500 }} src={url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    )
  }

  const renderHelps = () => {
    return <>
      {records.length ? records.map((record, key) => (
        <Accordion key={key}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>{record.title}</Typography>
            <Typography className={classes.secondaryHeading}>{record.description}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{renderVideo(record)}</Typography>
          </AccordionDetails>
        </Accordion>
      )) : null}
    </>
  }

  return (
    <MainContainer>
      <MainHeader>
        <Title>{i18n.t("helps.title")}</Title>
        <MainHeaderButtonsWrapper>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
				{ renderHelps() }
			</Paper>

    </MainContainer>
  );
};

export default Helps;
