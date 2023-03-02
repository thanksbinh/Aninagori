import dynamic from 'next/dynamic';

const MyClientComponent = dynamic(() => import('./Profile'), {
  ssr: false,
});

export default function MyServerComponent() {
    
  // code here
  return <MyClientComponent/>;
}
