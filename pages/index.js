import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import fire from '../config/firebaseConfig';
import { pickBy } from 'lodash'

export default function Home () {
  const [question, setQuestion] = useState();
  const [isDone, setIsDone] = useState( false );
  const [cookies, setCookies] = useCookies( "" )
  const [participantId, setParticipantId] = useState()


  useEffect( () => {
    if ( participantId ) { loadQuestion() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId] );

  const db = fire.firestore();
  const participantsRef = db.collection( "participants" )
  const jamsRef = db.collection( "jams" )

  const loadQuestion = () => {
    jamsRef.doc( '6y4qC5HoThwkMKJiBrLn' ).get().then( ( doc ) => {
      let jam = doc.data();
      jam.statements = {}
      const statementsPromise = jamsRef
        .doc( doc.id )
        .collection( "statements" ).get().then( query => {
          query.forEach( statement => {
            const statement_id = statement.id
            jam.statements[statement_id] = statement.data()
          } )
          return jam;
        } );

      const allVotes = []
      const votesPromise = participantsRef
        .doc( participantId )
        .collection( "votes" )
        .get()
        .then( query => {
          query.forEach( vote => allVotes.push( vote.data().statementId ) );
          return allVotes;
        } )

      Promise.all( [statementsPromise, votesPromise] )
        .then( ( [jam, votes] ) => {
          const unansweredQs = pickBy( jam.statements, ( value, key ) => !votes.includes( key ) )
          const keys = Object.keys( unansweredQs );
          if ( !keys.length ) {
            setIsDone( true )
            return;
          }

          const randomKey = keys[keys.length * Math.random() << 0]
          const randomQ = unansweredQs[randomKey];
          randomQ.key = randomKey

          setQuestion( randomQ )
        } );
    } );
  }

  const sendRequest = ( vote ) => {
    let voteValue = ""
    switch ( vote ) {
      case "agree": {
        voteValue = 1;
        break;
      }
      case "disagree": {
        voteValue = -1;
        break;
      }
      case "skip": { voteValue = 0; break; }
      default: console.error( "No vote" )
    }


    participantsRef.doc( participantId ).collection( "votes" ).add( {
      jamId: "6y4qC5HoThwkMKJiBrLn",
      statementId: question.key,
      vote: voteValue,
      createdAt: fire.firestore.Timestamp.now()
    } )
      .then( () => {
        console.log( "Document successfully written!" );
        loadQuestion()
      } )
      .catch( ( error ) => {
        console.error( "Error writing document: ", error );
      } );
  }

  useEffect( () => {
    const id = cookies['jams-participant'];
    if ( id ) { setParticipantId( id ) }
    else { settingIdCookies() }

  }, [cookies] )

  const settingIdCookies = () => {
    participantsRef.add( {} ).then( docRef => {
      setCookies( "jams-participant", docRef.id )
    } )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>JAMS</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {!isDone ? question ? question.text : 'Loading...' : 'All done'}
        </h1>

        {!isDone &&
          <>
            <h3>Participant id: {participantId}</h3>
            <button onClick={() => sendRequest( "agree" )}>Agree</button>
            <button onClick={() => sendRequest( "disagree" )}>Disagree</button>
            <button onClick={() => sendRequest( "skip" )}>Skip</button>
          </>
        }
      </main>

      <footer className={styles.footer}>
        <a>
          Powered by Red Badger
        </a>
      </footer>
    </div>
  )
}
