import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import fire from '../config/firebaseConfig';
import { pickBy } from 'lodash'


const Post = () => {
  const router = useRouter()
  const { jam } = router.query

  const [question, setQuestion] = useState();
  const [isDone, setIsDone] = useState( false );

  useEffect( () => {
    if (router.isReady) {
      loadQuestion()
    }
  }, [router.isReady] );

  const loadQuestion = () => {
    const db = fire.firestore();
    console.log(jam, "Jam URL PATH")

    db.collection( "jams" )
    .where("urlPath", "==", jam)
    .get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
      let jamData = doc.data();
      jamData.statements = {}

      const statementsPromise = db.collection( "jams" )
        .doc( doc.id )
        .collection( "statements" ).get().then( query => {
          query.forEach( statement => {
            const statement_id = statement.id
            jamData.statements[statement_id] = statement.data()
          } )
          return jamData;
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
          const unansweredQs = pickBy( jamData.statements, ( value, key ) => !votes.includes( key ) )

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

export default Post
