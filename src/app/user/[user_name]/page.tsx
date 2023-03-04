import dynamic from 'next/dynamic';

const MyClientComponent = dynamic(() => import('./Profile'), {
  ssr: false,
});

export default function MyServerComponent({params} : { params: any}) {
  
  return <MyClientComponent {...params}/>;
}
