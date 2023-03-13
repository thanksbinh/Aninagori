import { ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  return (
    <Transition show={isOpen} as={Dialog} onClose={onClose}>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Transition.Child
            as={Dialog.Overlay}
            className="fixed inset-0 bg-black opacity-40"
          />
          <div className="bg-white rounded-lg p-4 z-20">
            <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
              {title}
            </Dialog.Title>
            <div className="mt-2">{children}</div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
