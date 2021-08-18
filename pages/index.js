import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';

import fire from '../config/firebaseConfig';

import { pickBy } from 'lodash'

export default function Home () {
  const [question, setQuestion] = useState();
  const [isDone, setIsDone] = useState( false );

  useEffect( () => {
    loadQuestion()
  }, [] );

  const loadQuestion = () => {
    const db = fire.firestore();
    db.collection( "jams" ).get().then( ( querySnapshot ) => {
      querySnapshot.forEach( ( doc ) => {
        let jam = doc.data();
        jam.statements = {}
        const statementsPromise = db.collection( "jams" )
          .doc( doc.id )
          .collection( "statements" ).get().then( query => {
            query.forEach( statement => {
              const statement_id = statement.id
              jam.statements[statement_id] = statement.data()
            } )
            return jam;
          } );

        const allVotes = []
        const votesPromise = db.collection( "participants" )
          .doc( 'BlNS4ZNBIJhEt1GJqEvm' )
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
    } );
  }

  const sendRequest = ( vote ) => {
    const db = fire.firestore();
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


    db.collection( "participants" ).doc( "BlNS4ZNBIJhEt1GJqEvm" ).collection( "votes" ).add( {
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
