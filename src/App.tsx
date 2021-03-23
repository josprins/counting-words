import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

// Custom Material UI styles
const styles = (_theme: any) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    formContainer: {
      maxWidth: '500px',
      margin: '25px auto 0 auto',
    },
    countBtn: {
      margin: '10px 0 0 0',
      color: '#535353',
      textTransform: 'none',
      fontWeight: 400,
    },
    singleWordInput: {
      fontSize: '0.2em',
      marginTop: '10px',
    },
    totalWords: {
      fontSize: '0.65em',
      color: '5#35353',
      margin: '-5px 0 0px 15px',
    },
    outputContainer: {
      marginTop: '10px',
      padding: '10px',
    },
    resultText: {
      color: '#4a4a4a',
      textDecoration: 'underline wave 1px',
      fontFamily: "'Roboto Mono', monospace",
    },
  });

// Interfaces
interface Props extends WithStyles<typeof styles> {
  classes: any;
}

interface WordFrequencyAnalyzer {
  calculateHighestFrequency(text: string): number | string;
  calculateFrequencyForWord(text: string, word: string): number;
  calculateMostFrequentNWords(text: string, n: string): [];
  handleCountAllWords(text: string, n: number): Object;
}

interface State {
  text: string;
  output: any;
  word: string;
  n: string;
  open: boolean;
}

class App extends React.Component<WordFrequencyAnalyzer | Props['classes'], State> {
  state: State = {
    text: '',
    word: '',
    output: '',
    n: '',
    open: false,
  };

  calculateHighestFrequency: WordFrequencyAnalyzer['calculateHighestFrequency'] = (
    text: string
  ): any => {
    if (text && isNaN(Number(text))) {
      const array: any = [...text.split(' ')];

      // Find most frequent array element(s) ({wich}) with their occurance ({mostFreq})
      var obj: any = {},
        mostFreq = 0,
        which: any[] = [];

      array.forEach((i: string) => {
        let item = i.toLowerCase().replace(/[.,#!$"%^&*;:{}=\-_`~()]/g, '');
        console.log(item);
        if (!obj[item]) {
          obj[item] = 1;
        } else {
          obj[item]++;
        }

        if (obj[item] > mostFreq) {
          mostFreq = obj[item];
          which = [item];
        } else if (obj[item] === mostFreq) {
          which.push(item);
        }
      });

      // Set output
      return this.setState({
        output: `The most used ${
          which.length > 1 ? 'words are' : 'word is'
        }: "${which.toString().replace(/,/g, '" & "')}" and ${
          which.length > 1 ? 'they appear' : 'it appears'
        } ${mostFreq} ${mostFreq > 1 ? 'times' : 'time'}`,
      });
    } else {
      this.setState({ open: true });
    }
  };

  calculateFrequencyForWord: WordFrequencyAnalyzer['calculateFrequencyForWord'] = (
    text,
    word
  ): any => {
    if (text && isNaN(Number(text)) && word && isNaN(Number(text))) {
      const strippedText = text.toLowerCase().replace(/[.,#!$"%^&*;:{}=\-_`~()]/g, '');
      const array = [...strippedText.split(' ')];

      // Filter out array elements that match the input word, put into new array and get array length
      const specificWordCount = array.filter(
        str =>
          str.toLowerCase().replace(/[.,#!$%^&*;:{}=\-_`~()]/g, '') === word.toLowerCase()
      ).length;

      // Set output
      this.setState({
        output: `"${word}" occurs ${specificWordCount} ${
          specificWordCount > 1 || specificWordCount === 0 ? 'times' : 'time'
        }`,
      });
    } else {
      this.setState({ open: true });
    }
  };

  calculateMostFrequentNWords: WordFrequencyAnalyzer['calculateMostFrequentNWords'] = text => {
    const array = [...text.split(' ')];
    if (text && isNaN(Number(text))) {
      // Return object where key = string and value = occurance
      return array
        .map(word => word.toLowerCase().replace(/[.,#!$%^&*;":{}=\-_`~()]/g, ''))
        .reduce((a: any, b: any): any => {
          if (typeof a[b] === 'undefined') {
            a[b] = 1;
          } else {
            a[b] += 1;
          }

          return a;
        }, {});
    }
  };

  handleCountAllNWords = (text: string, n: string) => {
    if (text && n && !isNaN(Number(n))) {
      // Turn into array and sort on value (occurance)
      const sortedArray = Object.entries(this.calculateMostFrequentNWords(text, n)).sort(
        function (a: any, b: any) {
          return b[1] - a[1];
        }
      );

      // Shorten array length by input N
      sortedArray.length = Number(n);

      // Push array items with the exact same value into sepperate arrays to form multidemensional array
      const multiArr: any[] = Object.entries(
        sortedArray.reduce(function (obj: any, value: any) {
          var key = value[1];
          if (obj[key] == null) obj[key] = [];

          obj[key].push(value);
          return obj;
        }, {})
      );

      // Sort nested array items in ascendant alphabetical order
      const alphabeticalArray: any[] = [];
      for (let i = 0; i < multiArr.length; i++) {
        alphabeticalArray.push(multiArr[i][1].sort());
      }

      // Reverse array so it starts with items with the highest value (occurance) and convert multidemensional array into single array
      const reversedSingleArray = alphabeticalArray
        .reverse()
        .reduce(function (prev, curr) {
          return prev.concat(curr);
        });

      // Set output
      this.setState({
        output: reversedSingleArray,
      });
    } else {
      this.setState({ open: true });
    }
  };

  render() {
    const { classes } = this.props;
    const { text, word, output, n, open } = this.state;

    return (
      <Container className={classes.formContainer}>
        <Typography style={{ fontSize: '2em' }}>Counting Words</Typography>
        <Collapse in={open}>
          <Alert
            severity='error'
            action={
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => {
                  this.setState({ open: false });
                }}
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }
          >
            Please provide the right data for the input fields!
          </Alert>
        </Collapse>
        <form
          className={classes.root}
          noValidate
          autoComplete='off'
          onSubmit={e => e.preventDefault()}
        >
          <TextField
            id='outlined'
            label='Input Field'
            placeholder='Type any text in here..'
            multiline
            value={text}
            margin='normal'
            InputLabelProps={{
              shrink: true,
            }}
            variant='outlined'
            onChange={e => {
              this.setState({ text: e.target.value });
            }}
          />
          <Typography className={classes.totalWords}>
            {text && `Total words: ${[...text.trim().split(' ')].length}`}
          </Typography>

          <TextField
            id='outlined'
            variant='outlined'
            label='Specific Word'
            placeholder='Type a single word here..'
            value={word}
            className={classes.singleWordInput}
            size='small'
            onChange={e => this.setState({ word: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id='outlined'
            variant='outlined'
            label='List Length'
            placeholder='Type a number here..'
            value={n}
            className={classes.singleWordInput}
            size='small'
            onChange={e => this.setState({ n: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            className={classes.countBtn}
            size='medium'
            variant='contained'
            onClick={() => {
              this.calculateHighestFrequency(text);
            }}
          >
            Find Most Frequent Word(s)
          </Button>
          <Button
            className={classes.countBtn}
            size='medium'
            variant='contained'
            onClick={() => this.calculateFrequencyForWord(text, word)}
          >
            Find Most Frequent Specific Word
          </Button>
          <Button
            className={classes.countBtn}
            size='medium'
            variant='contained'
            onClick={() => this.handleCountAllNWords(text, n)}
          >
            Find The Most Frequent Word(s) With Provided List Length
          </Button>
        </form>
        {output && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <Typography className={classes.resultText}>
                Result
                <span style={{ fontSize: '23px', marginLeft: '4px' }}>&#8595;</span>
              </Typography>
              <Button
                className={classes.countBtn}
                style={{ padding: '1px 8px', color: '#fff' }}
                size='medium'
                color='secondary'
                variant='contained'
                onClick={() =>
                  this.setState({
                    text: '',
                    word: '',
                    n: '',
                    output: '',
                    open: false,
                  })
                }
              >
                reset
              </Button>
            </div>
            <Paper className={classes.outputContainer}>
              {typeof output !== 'string' ? '{ ' : null}
              {typeof output !== 'string' ? (
                output.map((item: any[], index: number) => (
                  <p
                    key={index}
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      display: 'inline-block',
                      lineHeight: '0px',
                    }}
                  >
                    {`("${item[0]}": ${item[1]}) ${
                      output.length === index + 1 ? '' : ', '
                    }`}
                    &nbsp;
                  </p>
                ))
              ) : (
                <p style={{ fontFamily: "'Roboto', sans-serif" }}>{output}</p>
              )}

              {typeof output !== 'string' ? '}' : null}
            </Paper>
          </>
        )}
      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
