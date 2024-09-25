'use client'

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Popup: React.FC<PopupProps> = (props) => {
  if (!props.isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-gray-800 p-8 rounded shadow-lg relative'>
        <button onClick={props.onClose} className='absolute top-2 right-3 text-gray-500 hover:text-gray-700'>
          &times;
        </button>
        {props.children}
      </div>
    </div>
  )
}

export default Popup
