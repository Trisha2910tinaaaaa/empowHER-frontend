import { MessageCircle } from "lucide-react"

export default function ChatbotPreview() {
  return (
    <div className="rounded-lg bg-pink-50 p-4 border border-pink-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-pink-800">Career Assistant</h3>
        <span className="bg-green-500 h-2 w-2 rounded-full"></span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-end">
          <div className="bg-pink-200 text-pink-800 rounded-lg py-2 px-3 max-w-[80%]">
            I have experience in marketing but want to try something new.
          </div>
        </div>

        <div className="flex">
          <div className="bg-white border border-pink-200 text-gray-800 rounded-lg py-2 px-3 max-w-[80%]">
            That's great! Marketing skills are transferable to many fields. Could you tell me what aspects of marketing
            you enjoy the most? For example, do you prefer the creative side, data analysis, or strategic planning?
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-pink-200 text-pink-800 rounded-lg py-2 px-3 max-w-[80%]">
            I really enjoy the data analysis part and seeing how campaigns perform.
          </div>
        </div>

        <div className="flex">
          <div className="bg-white border border-pink-200 text-gray-800 rounded-lg py-2 px-3 max-w-[80%]">
            Based on your interest in data analysis, you might enjoy roles in Data Analytics, Business Intelligence, or
            Product Management. These fields would let you use your analytical skills while exploring new challenges!
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <div className="flex-1 text-center text-pink-600">
          <MessageCircle className="inline-block mr-2 h-4 w-4" />
          <span className="text-sm">Click to start your career conversation</span>
        </div>
      </div>
    </div>
  )
}

