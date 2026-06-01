import Image from 'next/image'

interface EmptyPageProps {
  img?: string;
  title?: string;
  description: string;
}

export default function EmptyPage({ img="/assets/Blockchain.png" ,title ,description }: EmptyPageProps) {
  return (
    <div className='flex flex-col items-center justify-center max-w-[564px] gap-4 min-h-[50vh] my-5'>
      <Image alt='empty' src={img} width={240} height={182} />
      <h2 className="text-[32px] font-[700] leading-[56px] tracking-[-2%] text-DarkSteel">{title}</h2>
      <p className=" font-[500] text-[16px] leading-6 text-black text-center">{description}</p>
      </div>
  )
}
